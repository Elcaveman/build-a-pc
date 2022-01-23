import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Stepper from 'bs-stepper';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';

@Component({
  selector: 'app-ecommerce-build',
  templateUrl: './ecommerce-build.component.html',
  styleUrls: ['./ecommerce-build.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceBuildComponent implements OnInit {
  // Public
  public contentHeader: object;
  public products;
  public currentBuild:any;

  public address = {
    fullNameVar: '',
    numberVar: '',
    flatVar: '',
    landmarkVar: '',
    cityVar: '',
    pincodeVar: '',
    stateVar: ''
  };

  // Private
  private checkoutStepper: Stepper;

  /**
   *  Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  getBuildItem(id){
    const indexRef = this.currentBuild.findIndex(currentBuildRef => currentBuildRef.productId === id); // Get the index ref
    return this.currentBuild[indexRef];
  }
  qtyChange(event,product){
    console.log("qtyChanged",event);
    this._ecommerceService.addToBuild(product.id,event);
  }
  /**
   * Stepper Next
   */
  nextStep() {
    this.checkoutStepper.next();
  }
  /**
   * Stepper Previous
   */
  previousStep() {
    this.checkoutStepper.previous();
  }

  /**
   * Validate Next Step
   *
   * @param addressForm
   */
  validateNextStep(addressForm) {
    if (addressForm.valid) {
      this.nextStep();
    }
  }
  
  /**
   * Remove From Cart
   *
   * @param product
   */
  removeFromBuild(product) {
    if (product.isInBuild === true) {
      this._ecommerceService.removeFromBuild(product.id);
    }
  }

  /**
   * Toggle Wishlist
   *
   * @param product
   */
  toggleWishlist(product) {
    if (product.isInWishlist === true) {
      this._ecommerceService.removeFromWishlist(product.id).then(res => {
        product.isInWishlist = false;
      });
    } else {
      this._ecommerceService.addToWishlist(product.id).then(res => {
        product.isInWishlist = true;
      });
    }
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to ProductList change
    this._ecommerceService.onProductListChange.subscribe(res => {
      this.products = res;
      this.products.isInBuild = false;
    });

    // Subscribe to currentBuild change
    this._ecommerceService.onCurrentBuildChange.subscribe(res => (this.currentBuild = res));
    // update product is in currentBuild & is in CartList : Boolean
    this.products.forEach(product => {
      
      product.isInBuild = this.currentBuild.findIndex(p => p.productId === product.id) > -1;
    });
    console.error(this.products);
  this.products.isInBuild = true;
    this.checkoutStepper = new Stepper(document.querySelector('#checkoutStepper'), {
      linear: false,
      animation: true
    });

    // content header
    this.contentHeader = {
      headerTitle: 'Checkout',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'eCommerce',
            isLink: true,
            link: '/'
          },
          {
            name: 'Checkout',
            isLink: false
          }
        ]
      }
    };
  }
  
}
