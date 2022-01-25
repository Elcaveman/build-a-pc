import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import Stepper from 'bs-stepper';
  
import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
import { Router } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ToastrService, GlobalConfig } from 'ngx-toastr';
import { CustomToastrComponent } from 'app/main/extensions/toastr/custom-toastr/custom-toastr.component';

@Component({
  selector: 'app-ecommerce-build',
  templateUrl: './ecommerce-build.component.html',
  styleUrls: ['./ecommerce-build.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceBuildComponent implements OnInit {
  // Public
  public cvv ="";
  public transactionStarted = false;
  public paymentOptions = {
    otherCard : false,
    onDelivery : false,
    default : true
  };
  public coupon : string;
  public contentHeader: object;
  public products;
  public currentBuild:any;
  public categoryList = ['cpu','gpu','ram','storage','motherboard','case','power','cpucooler','sound','other'];
  public address = {
    fullNameVar: '',
    numberVar: '',
    flatVar: '',
    landmarkVar: '',
    cityVar: '',
    pincodeVar: '',
    stateVar: ''
  };
  public checkoutDetails: {
    total : number;
    deliveryCharges : number;
    estimatedTax : number;
    discount:number;
  };
  public cardDetails={
    owner:"JOHN DOE",
    cardNumber:"123 54678 15343 10"
  };
  public tempCardDetails={
    owner:"",
    cardNumber:""
  }
  // Private
  private checkoutStepper: Stepper;
  
  private options: GlobalConfig;

  /**
   *  Constructor
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService,
    private _router:Router,private toastr: ToastrService) {
      this.options = this.toastr.toastrConfig;
    }

  // Public Methods
  // -----------------------------------------------------------------------------------------------------
  validateCVV(cvv){
    this.toastrCustomWarning('Validating CVV via the GBO','Please wait...');
    setTimeout(()=>{
      if (cvv == "1010") this.toastrCustomSuccess('Transaction can be seen in invoices','Success! Valid CVV');
      else this.toastrCustomFailure('The CVV is invalid the transaction will be reset!','Failed! Invalid CVV');
    },2000);
  }  
  // Custom Success
    toastrCustomSuccess(message,title) {
      const customToastrRef = cloneDeep(this.options);
      customToastrRef.toastComponent = CustomToastrComponent;
      customToastrRef.closeButton = true;
      customToastrRef.tapToDismiss = false;
      customToastrRef.progressBar = true;
      customToastrRef.toastClass = 'toast ngx-toastr';
      this.toastr.success(message, title, customToastrRef);
    }
    // Failure
    toastrCustomFailure(message,title) {
      const customToastrRef = cloneDeep(this.options);
      customToastrRef.toastComponent = CustomToastrComponent;
      customToastrRef.closeButton = true;
      customToastrRef.tapToDismiss = false;
      customToastrRef.progressBar = true;
      customToastrRef.toastClass = 'toast ngx-toastr';
      this.toastr.error(message,title,customToastrRef);
    }
    // Custom Warning
    toastrCustomWarning(message,title) {
      const customToastrRef = cloneDeep(this.options);
      customToastrRef.toastComponent = CustomToastrComponent;
      customToastrRef.closeButton = true;
      customToastrRef.tapToDismiss = false;
      customToastrRef.progressBar = true;
      customToastrRef.toastClass = 'toast ngx-toastr';
      this.toastr.warning(message,title,customToastrRef);
    }
    
  setDefaultCard(){
    this.cardDetails.owner = this.tempCardDetails.owner;
    this.cardDetails.cardNumber = this.tempCardDetails.cardNumber;
  }
  setPaymentOptions(option){
    for (let key in this.paymentOptions){
      this.paymentOptions[key] = false;
    }
    switch (option) {
      case "card":
        this.paymentOptions.otherCard=true;
        break;
      case "delivery":
        this.paymentOptions.onDelivery=true;
        break;
      default:
        this.paymentOptions.default=true;
        break;
    }
    this.setPaymentOptions
  }
  setCardDetails(owner:string,cardNumber:string){
    this.cardDetails.cardNumber=cardNumber;
    this.cardDetails.owner=owner;
  }
  checkoutTotal(){
    let total = 0;
    for (let key in this.checkoutDetails){
      total += this.checkoutDetails[key]
    }
    return total;
  }
  resetCheckout(){
    this.checkoutDetails = {
      total : 0,
      deliveryCharges : 0,
      estimatedTax : 0,
      discount:0,
    }
  }
  applyCoupon(coupon){
    if (coupon == "MUDAMUDA"){
      this.checkoutDetails.discount = -50;
      this.toastrCustomSuccess("coupon MUDAMUDA has been Applied! you got a 50MAD reduction!","Valid coupon! 👌");
    }
    else if (coupon == "ENSIAS"){
      this.checkoutDetails.discount = -1000;
      this.toastrCustomSuccess("coupon ENSIAS has been Applied! you got a 1000MAD reduction!","Valid coupon! 👌");
    }
    else this.toastrCustomFailure("This Coupon is either Invalid or have expired","Invalid coupon 😢")
  }

  eventHandler(event,category){
    if (event){
      if (event=='add'){
        this._router.navigateByUrl(`apps/e-commerce/shop?filter=${category}`);
      }
    }
  }
  getBuildItem(id){
    const indexRef = this.currentBuild.findIndex(currentBuildRef => currentBuildRef.productId === id); // Get the index ref
    return this.currentBuild[indexRef];
  }
  qtyChange(event,product){
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
      this.toastrCustomSuccess("Your delivery address has been correctly set","Address Has Been Set!");
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
    this._ecommerceService.onCurrentBuildChange.subscribe(res => {
      this.currentBuild = res;
       // update product is in currentBuild & is in CartList : Boolean
      this.resetCheckout();
      this.products.forEach(product => {
        product.isInBuild = this.currentBuild.findIndex(p => p.productId === product.id) > -1;
        if (product.isInBuild){
          this.checkoutDetails.total += product.price;
          // tax fixed at 5%
          this.checkoutDetails.estimatedTax += (5/100)*product.price;
          if (!product.hasFreeShipping) {
            this.checkoutDetails.deliveryCharges += product.shippingPrice;
          }
        }
      });
      
    });  
    
    this.products.isInBuild = true;
    this.checkoutStepper = new Stepper(document.querySelector('#checkoutStepper'), {
      linear: false,
      animation: true
    });

    // content header
    this.contentHeader = {
      headerTitle: 'Select Parts',
      actionButton: false,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Shop',
            isLink: true,
            link: '/'
          },
          {
            name: 'Build',
            isLink: false
          }
        ]
      }
    };
  }
  
}
