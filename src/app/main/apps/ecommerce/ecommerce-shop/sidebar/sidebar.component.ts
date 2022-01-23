import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EcommerceService } from 'app/main/apps/ecommerce/ecommerce.service';
@Component({
  selector: 'ecommerce-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['../ecommerce-shop.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EcommerceSidebarComponent implements OnInit {
  // Public
  public sliderPriceValue = [1, 6];

  constructor(private _ecommerceService: EcommerceService,) {}

  ngOnInit(): void {
  }
  filterProduct(key,value){
    this._ecommerceService.filterProduct(key,value);
  }
}
