import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EcommerceService implements Resolve<any> {
  // Public
  public productList: Array<any>;
  public wishlist: Array<any>;
  public cartList: Array<any>;
  public currentBuild: Array<any>;
  public selectedProduct;
  public relatedProducts;

  public onProductListChange: BehaviorSubject<any>;
  public onRelatedProductsChange: BehaviorSubject<any>;
  public onWishlistChange: BehaviorSubject<any>;
  public onCartListChange: BehaviorSubject<any>;
  public onCurrentBuildChange:BehaviorSubject<any>;
  public onSelectedProductChange: BehaviorSubject<any>;

  // Private
  private idHandel;

  private sortRef = key => (a, b) => {
    const fieldA = a[key];
    const fieldB = b[key];

    let comparison = 0;
    if (fieldA > fieldB) {
      comparison = 1;
    } else if (fieldA < fieldB) {
      comparison = -1;
    }
    return comparison;
  };
  private filterRef = (key,value) => (a) =>{
    const fieldA = a[key];
    return fieldA === value;
  }

  /**
   * Constructor
   *
   * @param {HttpClient} _httpClient
   */
  constructor(private _httpClient: HttpClient) {
    this.onProductListChange = new BehaviorSubject({});
    this.onRelatedProductsChange = new BehaviorSubject({});
    this.onWishlistChange = new BehaviorSubject({});
    this.onCartListChange = new BehaviorSubject({});
    this.onSelectedProductChange = new BehaviorSubject({});
    this.onCurrentBuildChange = new BehaviorSubject({});
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.idHandel = route.params.id;

    return new Promise<void>((resolve, reject) => {
      Promise.all([this.getProducts(), this.getWishlist(), this.getCartList(), this.getCurrentBuild(),this.getSelectedProduct()]).then(() => {
        resolve();
      }, reject);
    });
  }

  /**
   * Get Products
   */
  getProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-products').subscribe((response: any) => {
        this.productList = response;
        this.sortProduct('featured'); // Default shorting
        resolve(this.productList);
      }, reject);
    });
  }

  /**
   * Get Wishlist
   */
  getWishlist(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-userWishlist').subscribe((response: any) => {
        this.wishlist = response;
        this.onWishlistChange.next(this.wishlist);
        resolve(this.wishlist);
      }, reject);
    });
  }

  /**
   * Get CartList
   */
  getCartList(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-userCart').subscribe((response: any) => {
        this.cartList = response;

        this.onCartListChange.next(this.cartList);
        resolve(this.cartList);
      }, reject);
    });
  }
  /**
   * Get current build
   */
  getCurrentBuild(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-userBuild').subscribe((response: any) => {
        this.currentBuild = response;

        this.onCurrentBuildChange.next(this.currentBuild);
        resolve(this.currentBuild);
      }, reject);
    });
  }
  
  /**
   * Get Selected Product
   */
  getSelectedProduct(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-products?id=' + this.idHandel).subscribe((response: any) => {
        this.selectedProduct = response;
        this.onSelectedProductChange.next(this.selectedProduct);
        resolve(this.selectedProduct);
      }, reject);
    });
  }

  /**
   * Get Related Products
   */
  getRelatedProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get('api/ecommerce-relatedProducts').subscribe((response: any) => {
        this.relatedProducts = response;
        this.onRelatedProductsChange.next(this.relatedProducts);
        resolve(this.relatedProducts);
      }, reject);
    });
  }

  /**
   * Sort Product
   *
   * @param sortBy
   */
  sortProduct(sortBy) {
    let sortDesc = false;

    const sortByKey = (() => {
      if (sortBy === 'price-desc') {
        sortDesc = true;
        return 'price';
      }
      if (sortBy === 'price-asc') {
        return 'price';
      }
      sortDesc = true;
      return 'id';
    })();

    const sortedData = this.productList.sort(this.sortRef(sortByKey));
    if (sortDesc) sortedData.reverse();
    this.productList = sortedData;
    this.onProductListChange.next(this.productList);
  }
  filterProduct(sortBy,value){
    let sortedData;
    console.log(value);
    if (value=='all'){
      sortedData = this.productList;
    }
    else{
      sortedData = this.productList.filter(this.filterRef(sortBy,value));
    }
    this.onProductListChange.next(sortedData);
  }
  filterByPrice(start:number,end:number){
    let filtedData;
    console.log("in");
    filtedData = this.productList.filter((product)=>{
        if (end !=null){
          if (start !=null) return start<=product.price && product.price<end;
          else return product.price<=end;
        }
        else if (start!=null){
          return start<=product.price
        }
        else{
          return true;
        }
      });
    this.onProductListChange.next(filtedData); 
  }
  /**
   * Add In Wishlist
   *
   * @param id
   */
  addToWishlist(id) {
    return new Promise<void>((resolve, reject) => {
      const lengthRef = this.wishlist.length + 1;
      const wishRef = { id: lengthRef, productId: id };

      this._httpClient.post('api/ecommerce-userWishlist/' + lengthRef, { ...wishRef }).subscribe(response => {
        this.getWishlist();
        resolve();
      }, reject);
    });
  }

  /**
   * Remove From Wishlist
   *
   * @param id
   */
  removeFromWishlist(id) {
    const indexRef = this.wishlist.findIndex(wishlistRef => wishlistRef.productId === id); // Get the index ref
    const indexId = this.wishlist[indexRef].id; // Get the product wishlist id from indexRef
    return new Promise<void>((resolve, reject) => {
      this._httpClient.delete('api/ecommerce-userWishlist/' + indexId).subscribe((response: any) => {
        this.getWishlist();
        resolve();
      }, reject);
    });
  }

  /**
   * Add In Cart
   *
   * @param id
   */
  addToCart(id) {
    return new Promise<void>((resolve, reject) => {
      const maxValueId = Math.max(...this.cartList.map(cart => cart.id), 0) + 1;
      const cartRef = { id: maxValueId, productId: id, qty: 1 };
      var cartId: any = '';

      // If cart is not Empty
      if (maxValueId !== 1) {
        cartId = maxValueId;
      }
      this._httpClient.post('api/ecommerce-userCart/' + cartId, { ...cartRef }).subscribe(response => {
        this.getCartList();
        resolve();
      }, reject);
    });
  }

  /**
   * Remove From Cart
   *
   * @param id
   */
  removeFromCart(id) {
    const indexRef = this.cartList.findIndex(cartListRef => cartListRef.productId === id); // Get the index ref
    const indexId = this.cartList[indexRef].id; // Get the product wishlist id from indexRef

    return new Promise<void>((resolve, reject) => {
      this._httpClient.delete('api/ecommerce-userCart/' + indexId).subscribe((response: any) => {
        this.getCartList();
        resolve();
      }, reject);
    });
  }

  /**
   * Add In Cart
   *
   * @param id
   */
  
  getBuildItem(id){
    const indexRef = this.currentBuild.findIndex(currentBuildRef => currentBuildRef.productId === id); // Get the index ref
    return this.currentBuild[indexRef];
  }
  addToBuild(id:number,qty?:number) {
    const indexRef = this.currentBuild.findIndex(currentBuildRef => currentBuildRef.productId === id); // Get the index ref
    const Ref = this.currentBuild[indexRef];
    
    if (typeof Ref == 'undefined'){
    return new Promise<void>((resolve, reject) => {
      const maxValueId = Math.max(...this.currentBuild.map(item => item.id), 0) + 1;
      const currentBuildRef = { id: maxValueId, productId: id, qty: 1 };
      var currentBuildId: any = '';

      // If currentBuild is not Empty
      if (maxValueId !== 1) {
        currentBuildId = maxValueId;
      }
      this._httpClient.post('api/ecommerce-userBuild/' + currentBuildId, { ...currentBuildRef }).subscribe(response => {
        this.getCurrentBuild();
        resolve();
      }, reject);
    });
    }
    else{
      const indexId = Ref.id; // Get the product wishlist id from indexRef
      if (qty>0){
        Ref.qty = qty;
      }
      else{
        Ref.qty +=1;
      }
      return new Promise<void>((resolve, reject) => {
        this._httpClient.put('api/ecommerce-userBuild/' + indexId, {...Ref}).subscribe((response: any) => {
          this.getCurrentBuild();
          resolve();
        }, reject);
        });
    }
  }

  /**
   * Remove From Cart
   *
   * @param id
   */
  removeFromBuild(id) {
    const indexRef = this.currentBuild.findIndex(currentBuildRef => currentBuildRef.productId === id); // Get the index ref
    const Ref = this.currentBuild[indexRef];
    const indexId = Ref.id; // Get the product wishlist id from indexRef
    // if (Ref.qty>1){
    //   Ref.qty -=1;
    //   return new Promise<void>((resolve, reject) => {
    //     this._httpClient.put('api/ecommerce-userBuild/' + indexId, {...Ref}).subscribe((response: any) => {
    //       this.getCurrentBuild();
    //       resolve();
    //     }, reject);
    //     });
    // }
    // else{
      return new Promise<void>((resolve, reject) => {
        this._httpClient.delete('api/ecommerce-userBuild/' + indexId).subscribe((response: any) => {
          this.getCurrentBuild();
          resolve();
        }, reject);
    });
    //}   
  }

}
