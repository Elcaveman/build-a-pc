import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';

@Component({
  selector: 'app-ecommerce-item',
  templateUrl: './ecommerce-item.component.html',
  styleUrls: ['./ecommerce-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
  host: { class: 'ecommerce-application' }
})
export class EcommerceItemComponent implements OnInit {
  // Input Decorotor
  @Input() product;
  @Input() isWishlistOpen = false;

  // Public
  public isInCart = false;

  /**
   *
   * @param {EcommerceService} _ecommerceService
   */
  constructor(private _ecommerceService: EcommerceService) {}

  // Public Methods
  // -----------------------------------------------------------------------------------------------------

  toggleWishlist() {
    if (this.product.isInWishlist === true) {
      this._ecommerceService.removeFromWishlist(this.product.id).then(res => {
        this.product.isInWishlist = false;
      });
    } else {
      this._ecommerceService.addToWishlist(this.product.id).then(res => {
        this.product.isInWishlist = true;
      });
    }
  }
  addToCart() {
    this._ecommerceService.addToCart(this.product.id).then(res => {
      this.product.isInCart = true;
    });
  }
  addToCurrentBuild() {
    this._ecommerceService.addToBuild(this.product.id).then(res => {
      this.product.isInBuild = true;
    });
  }
  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------
  ngOnInit(): void {}
}
