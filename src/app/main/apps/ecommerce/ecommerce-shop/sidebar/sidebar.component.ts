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
  public priceRanges =["All","<=100MAD","100MAD - 1000MAD","1000MAD - 5000MAD",">=5000MAD"];
  constructor(private _ecommerceService: EcommerceService,) {}

  ngOnInit(): void {
    this.filterProduct('category');
  }
  filterProduct(key,value?:string){
    if (value) this._ecommerceService.filterProduct(key,value);
    else this._ecommerceService.filterProduct(key,this.defaultFilter);
  }
  filterByPrice(priceRange){
    switch (priceRange) {
      case this.priceRanges[1]:
        this._ecommerceService.filterByPrice(0,100);
        break;
      case this.priceRanges[2]:
        this._ecommerceService.filterByPrice(100,1000);
        break;
      case this.priceRanges[3]:
        this._ecommerceService.filterByPrice(1000,5000);
        break;
      case this.priceRanges[4]:
        this._ecommerceService.filterByPrice(5000,null);
        break;
      default:
        this._ecommerceService.filterByPrice(null,null);
        break;
    }
  }
}
