import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';
import { StockGeneralComponent } from '../stock-general/stock-general.component';
import { StockMetalComponent } from '../stock-metal/stock-metal.component';
import { StockStoneComponent } from '../stock-stone/stock-stone.component';
import { StockPackagingComponent } from '../stock-packaging/stock-packaging.component';
import { StockFeatureComponent } from '../stock-feature/stock-feature.component';
import { StockPriceComponent } from '../stock-price/stock-price.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [
    CommonModule,
    NgFor,
    FormsModule,
    StockGeneralComponent,
    StockMetalComponent,
    StockStoneComponent,
    StockPackagingComponent,
    StockFeatureComponent,
    StockPriceComponent
  ],
  templateUrl: './product-edit.component.html',
  styleUrl: './product-edit.component.css'
})
export class ProductEditComponent implements OnInit {
  router = inject(Router);

  listTypes: string[] = ['General', 'categories', 'List 3'];
  selectedListType: string = '';

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
    private stockGeneralService: StockGeneralService,
    private tabCommService: TabCommunicationService,
    private route: ActivatedRoute,
    private sharedProductService: SharedProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const sharedProductId = params.get('id');
      if (sharedProductId) {
        this.sharedProductService.setProductId(sharedProductId);
        localStorage.setItem('createdProductId', sharedProductId.toString());
        console.log("Edit Mode Product ID:", sharedProductId);
      }
    });

    this.tabCommService.setActiveTab(0);

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
    } else if (this.selectedListType === 'categories') {
      this.router.navigate(['categories-list']);
    }
  }

  getProductId() {
    this.productId = localStorage.getItem('createdProductId');
    return this.productId ? JSON.parse(this.productId) : null;
  }

  get isProductIdPresent(): boolean {
    return this.getProductId() !== null;
  }

  discardProductId() {
    localStorage.setItem('createdProductId', JSON.stringify(null));
  }

  goToCustomizeForm() {
    this.router.navigate(['/customize-form']); // for the customize list
  }
}
