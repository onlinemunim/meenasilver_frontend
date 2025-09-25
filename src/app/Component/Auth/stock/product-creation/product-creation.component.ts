import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockGeneralComponent } from '../stock-general/stock-general.component';
import { StockMetalComponent } from '../stock-metal/stock-metal.component';
import { StockStoneComponent } from '../stock-stone/stock-stone.component';
import { StockPackagingComponent } from '../stock-packaging/stock-packaging.component';
import { StockFeatureComponent } from '../stock-feature/stock-feature.component';
import { StockPriceComponent } from '../stock-price/stock-price.component';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';

@Component({
  selector: 'app-product-creation',
  standalone: true,
   imports: [CommonModule, NgFor, FormsModule,StockGeneralComponent, StockMetalComponent, StockStoneComponent, StockPackagingComponent, StockFeatureComponent, StockPriceComponent],
  templateUrl: './product-creation.component.html',
  styleUrl: './product-creation.component.css'
})
export class ProductCreationComponent implements OnInit {
  router = inject(Router);

  // for list
  listTypes: string[] = ['General', 'categories', 'List 3'];
  selectedListType: string = '';

  // for stock tab
  activeTab = 0;

  tabs = [
    { id: 'general', label: 'General Details' },
    { id: 'metal', label: 'Silver Part Details' },
    { id: 'stone', label: 'Stone Details' },
    { id: 'packaging', label: 'Packaging Details' },
    { id: 'feature', label: 'Add Feature Details' },
    { id: 'price', label: 'Price Details' },
  ];
  selectedOption: any;
  productId: any;
  productData: any;

  constructor(
    private stockGeneralServiece:StockGeneralService,
    private tabCommService: TabCommunicationService,
    private route:ActivatedRoute,
    private sharedProductService:SharedProductService,
  ){}

  ngOnInit(): void {
    this.sharedProductService.setProductId(null);
    localStorage.setItem('createdProductId', JSON.stringify(null));

    this.tabCommService.setActiveTab(0);

    // Subscribe to tab change from the service
    this.tabCommService.activeTabIndex$.subscribe((index: number) => {
      this.activeTab = index;
    });
  }


  selectTab(index: number) {
    this.activeTab = index;
    localStorage.setItem('activeTab', index.toString());
  }

  showRelatedList() {
    if (this.selectedListType === 'General') {
      this.router.navigate(['general-list']);
    }else if (this.selectedListType === 'categories') {
      this.router.navigate(['categories-list']);
    }
  }

  getProductId(){
    this.productId = localStorage.getItem('createdProductId');
    return this.productId ? JSON.parse(this.productId) : null;
  }

  get isProductIdPresent(): boolean {
    return this.getProductId() !== null;
  }

  discardProductId(){
    localStorage.setItem('createdProductId',JSON.stringify(null))
  }


  ifUserWantContinueWithOldData() {
    this.getStockGeneralDetails();

  }

  restoreDataMsg(){
    if(this.getProductId()!==null){
      this.ifUserWantContinueWithOldData();
    }
  }

  goToCustomizeForm() {
    this.router.navigate(['/customize-form']);
  }

  getStockGeneralDetails(){
    this.stockGeneralServiece.getProductById(localStorage.getItem('createdProductId')).subscribe((response:any)=>{
      this.productData = response.data;
      console.log("hihihh",this.productData);

      Swal.fire({
        title: 'Data Restore?',
        html: `
          <p style="color: #c19725;"><b>Do you want to continue with : </b></p><br>
         <table style="width: 100%; color: black; border-collapse: collapse;">
            <tr>
              <td style="text-align: right; padding: 4px;"><b>Brandname :&nbsp;</b></td>
              <td style="text-align: left; padding: 4px;">${this.productData.brand_name}</td>
            </tr>
            <tr>
              <td style="text-align: right; padding: 4px;"><b>Barcode :&nbsp;</b></td>
              <td style="text-align: left; padding: 4px;">${this.productData.barcode}</td>
            </tr>
            <tr>
              <td style="text-align: right; padding: 4px;"><b>Product Group :&nbsp;</b></td>
              <td style="text-align: left; padding: 4px;">${this.productData.group}</td>
            </tr>
            <tr>
              <td style="text-align: right; padding: 4px;"><b>Product SKU :&nbsp;</b></td>
              <td style="text-align: left; padding: 4px;">${this.productData.unique_code_sku}</td>
            </tr>
         </table>

        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continue',
        cancelButtonText: '+ Create New Product',
        confirmButtonColor: '#c19725',
        cancelButtonColor: '#c19725',
        background: '#fff',
        color: '#000',
        customClass: {
          popup: 'auto-size-alert',
        },
      }).then((result) => {
        if (result.isConfirmed) {

        } else if (result.dismiss === Swal.DismissReason.cancel) {
          this.discardProductId();


          const currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate([currentUrl]);
        });
      }
      });
    })
  }
}


