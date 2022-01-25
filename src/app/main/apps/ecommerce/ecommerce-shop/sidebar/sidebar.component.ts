import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
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
  @Input() defaultFilter ="all";
  public filters = [{name:'all',verboseName:'All'}
  ,{name:'cpu',verboseName:'CPU - Microprocessor'}
  ,{name:'gpu',verboseName:'GPU - Video Card'}
  ,{name:'ram',verboseName:'RAM'}
  ,{name:'storage',verboseName:'Disk Storage'}
  ,{name:'motherboard',verboseName:'Motherboard'}
  ,{name:'case',verboseName:'Case'}
  ,{name:'power',verboseName:'Power Supply'}
  ,{name:'cpucooler',verboseName:'CPU Cooler'}
  ,{name:'sound',verboseName:'Sound Card'}
  ,{name:'other',verboseName:'Accessory'}
];
  constructor(private _ecommerceService: EcommerceService,) {}

  ngOnInit(): void {
    this.filterProduct('category');
  }
  filterProduct(key,value?:string){
    if (value) this._ecommerceService.filterProduct(key,value);
    else this._ecommerceService.filterProduct(key,this.defaultFilter);
  }
}
