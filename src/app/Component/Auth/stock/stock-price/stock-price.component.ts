import { Component, OnDestroy, OnInit } from '@angular/core'; // <-- Import OnDestroy
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { StockPriceService } from '../../../../Services/Product_Creation/stock-price.service';
import { FirmSelectionService, selectedFirmName } from '../../../../Services/firm-selection.service';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { NgFor, NgIf } from '@angular/common';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import { HttpParams } from '@angular/common/http';
import { NotificationService } from '../../../../Services/notification.service';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';
import { MetalService } from '../../../../Services/metal.service';
import { ProductService } from '../../../../Services/product.service';
import { PackagingService } from '../../../../Services/Product_Creation/packaging.service';

// --- NEW IMPORTS ---
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service';
import { ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-stock-price',
  standalone: true,
  imports: [CustomSelectComponent, ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './stock-price.component.html',
  styleUrl: './stock-price.component.css',
})
export class StockPriceComponent implements OnInit, OnDestroy { // <-- Implement OnDestroy

  // --- Component State ---
  selectedFirm: selectedFirmName | null = null;
  stockWastageDetails: any;
  wastageData: any;
  productId: any;
  createdProduct: any;
  newlyCreatedProduct: any;
  priceData: any;
  priceDetails: any;
  stockPriceData: any;
  priceId: any;
  priceDataForFinalValue: any;
  showPriceSubmitButton: boolean = true;
  showPriceUpdateButton: boolean = false;

  // --- NEW: State Management for Field Visibility ---
  private destroy$ = new Subject<void>();
  visibleFields: Set<string> = new Set(); // Use a Set for fast lookups.

  constructor(
    private fb: FormBuilder,
    private stockPriceService: StockPriceService,
    private firmSelectionService: FirmSelectionService,
    private stockGeneralService: StockGeneralService,
    private tabCommService: TabCommunicationService,
    private notificationService: NotificationService,
    private sharedProductService: SharedProductService,
    private metalService: MetalService,
    private productservice: ProductService,
    private packagingService: PackagingService,
    private customizeService: CustomizeService, // <-- INJECT
    private cdr: ChangeDetectorRef // <-- INJECT
  ) {
    // REMOVED incorrect localStorage logic
  }

  ngOnInit(): void {
    this.customizeService.priceFieldsVisibility$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visibleFieldsSet => {
        this.visibleFields = visibleFieldsSet;
        this.cdr.detectChanges();
      });

    this.createdProduct = this.stockGeneralService.getCreatedProduct();

    this.firmSelectionService.selectedFirmName$.pipe(takeUntil(this.destroy$)).subscribe((firm: any) => {
      this.selectedFirm = firm?.id;
      const productId = this.getCurrentProductId();

      this.initStockPriceForm();
      this.initWastageDetailsForm();

      if (productId !== null) {
        this.getCurrentProductData();
        // this.getAllWastageData();
        this.getPriceDetails();
        this.getFinalPriceDetails(productId);
        this.getTotalPurchasePrice(productId);
      }

      if (this.getIdFromSharedService()) {
        this.getAllWastageDataForEdit();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * NEW: Helper function for the template to check field visibility.
   * This is the bridge between the service and the HTML.
   */
  isVisible(fieldKey: string): boolean {
    // Fallback: If settings haven't loaded, show everything to avoid a blank form.
    if (this.visibleFields.size === 0) {
      return true;
    }
    return this.visibleFields.has(fieldKey);
  }

  // --- ALL YOUR OTHER CODE IS UNCHANGED AND CORRECT ---

  // for GST
  gstTypes: string[] = ['GST'];
  selectedGstType: string = '';

  // for types
  purAccTypes: string[] = ['Account Name'];
  selectedPurAccType: string = '';

  // for types
  saleAccTypes: string[] = ['Account Name'];
  selectedSaleAccType: string = '';

  // for unit type
  unitTypes: string[] = ['GM (Gram)', 'KG (KiloGram)', 'MG (MilliGram)', 'CT (Carat)',];
  selectedUnits: string = '';

  // for l_unit_type
  l_unitTypes: string[] = ['GM (Gram)', 'KG (KiloGram)', 'MG (MilliGram)', 'CT (Carat)',];
  selected_l_Units: string = '';

  // for wastage type
  wstgUnitTypes: string[] = ['GM', 'KG', 'MG', 'CT'];
  selectedWstgUnits: string = '';

  // for wastage w_type
  wstgUnit_W_Types: string[] = ['GM', 'KG', 'MG', 'CT'];
  selectedWstg_W_Units: string = '';

  // for wastage m_type
  wstgUnit_M_Types: string[] = ['GM', 'KG', 'MG', 'CT'];
  selectedWstg_M_Units: string = '';

  // for unit type
  groupTypes: string[] = ['Diamond', 'Silver'];
  selectedgroups: string = '';

  stockPriceForm!: FormGroup;

  onCtrlEnter() {
    if (this.showPriceSubmitButton) {
      this.addWastageDetails();
    }
  }

  initStockPriceForm() {
    const userId = this.getCurrentUserId();
    this.stockPriceForm = this.fb.group({
      subunit_price: [''],
      unit_price: [''],
      thread_price: [''],
      labour_charges: [''],
      purchase_price: [''],
      sell_price: [''],
      mrp: [''],
      gst: [''],
      tax_in_price: [''],
      purchase_price_with_gst: [''],
      sell_price_with_gst: [''],
      mrp_with_gst: [''],
      wholesale_sell_price: [''],
      wholesale_sell_quantity: [''],
      wholesale_sell_purchase_price: [''],
      wholesale_sell_purchase_quantity: [''],
      wholesale_sell_price_with_gst: [''],
      wholesale_purchase_price_with_gst: [''],
      low_stock_unit: [''],
      l_unit_type: ['GM (Gram)'],
      min_wastage: [''],
      max_wastage: [''],
      w_type: ['GM'],
      min_making: [''],
      max_making: [''],
      m_type: ['GM'],
      wholesale_min_stock: [''],
      type: ['GM'],
      silver_rate: [''],
      silver_wt: [''],
      user_id: [userId],
      firm_id: [this.selectedFirm],
      product_id: [localStorage.getItem('createdProductId')],
    });
    this.stockPriceForm.get('subunit_price')?.valueChanges.subscribe(() => this.updatePurchasePrice());
    this.stockPriceForm.get('unit_price')?.valueChanges.subscribe(() => this.updatePurchasePrice());
    this.stockPriceForm.get('labour_charges')?.valueChanges.subscribe(() => this.updatePurchasePrice());
    this.stockPriceForm.get('thread_price')?.valueChanges.subscribe(() => this.updatePurchasePrice());
    this.stockPriceForm.get('silver_rate')?.valueChanges.subscribe(() => this.updatePurchasePrice());
    this.stockPriceForm.get('silver_wt')?.valueChanges.subscribe(() => this.updatePurchasePrice());
  }

  private updatePurchasePrice(): void {
    const subUnit = parseFloat(this.stockPriceForm.get('subunit_price')?.value) || 0;
    const mainUnit = parseFloat(this.stockPriceForm.get('unit_price')?.value) || 0;
    const labourCharges = parseFloat(this.stockPriceForm.get('labour_charges')?.value) || 0;
    const threadPrice = parseFloat(this.stockPriceForm.get('thread_price')?.value) || 0;
    const silverRate = parseFloat(this.stockPriceForm.get('silver_rate')?.value) || 0;
    const finalPrice = parseFloat(this.stockPriceForm.get('silver_wt')?.value) || 0;

    const total = subUnit + mainUnit + labourCharges + threadPrice;
    const finalTotal = total / silverRate;

    this.stockPriceForm.patchValue({ purchase_price: total.toFixed(2) }, { emitEvent: false });
    this.stockPriceForm.patchValue({ silver_wt: finalTotal.toFixed(2) }, { emitEvent: false });
  }

  initWastageDetailsForm() {
    const userId = this.getCurrentUserId();
    this.stockWastageDetails = this.fb.group({
      user_group: [''],
      wastage: [''],
      making_charges: [''],
      unit: ['GM (Gram)'],
      other_charges: [''],
      user_id: [userId],
      firm_id: [this.selectedFirm],
      product_id: [localStorage.getItem('createdProductId')],
    })
  }

  addWastageDetails() {
    this.stockPriceService.createWastage(this.stockWastageDetails.value).subscribe((response: any) => {
      // this.getAllWastageData();
      this.clearWastageData();
    })
  }

//   getAllWastageData() {
//     const productId = this.getCurrentProductId();
//     if (productId !== null) {
//       this.stockPriceService.getWestageListByProductId(productId).subscribe((response: any) => {
//         this.wastageData = response.data.filter((wastage: any) => wastage.product_id === productId);
//       });
//     }
// }

  deleteWastageDetail(id: any) {
    this.stockPriceService.deleteWastage(id).subscribe(
      (response: any) => {
        this.notificationService.showSuccess('Wastage deleted successfully', 'Success');
        if (this.getIdFromSharedService()) {
          this.getAllWastageDataForEdit();
        }
      },
      (error) => {
        console.error('Error deleting wastage:', error);
        this.notificationService.showError('Failed to delete wastage. Please try again.', 'Error');
      }
    );
  }

  clearWastageData() {
    const firmId = this.stockWastageDetails.get('firm_id')?.value;
    this.stockWastageDetails.reset({ unit: 'GM (Gram)', });
    this.stockWastageDetails.patchValue({ firm_id: firmId, product_id: this.productId, });
  }

  onSubmit(): void {
    if (this.stockPriceForm.invalid) {
      this.stockPriceForm.markAllAsTouched();
      this.notificationService.showError('Please fill all required fields.', 'Validation Error');
      return;
    }
    this.stockPriceService.createStocksPrice(this.stockPriceForm.value).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Stock price saved successfully!', 'Success');
        this.getPriceDetails();
        const productId = this.getCurrentProductId();
        if (productId !== null) {
          this.getFinalPriceDetails(productId);
        }
        this.clearForm();
      },
      error: (err) => {
        console.error('Error while creating stock price:', err);
        this.notificationService.showError('Something went wrong while saving the stock price.', 'Submission Error');
      }
    });
  }

  clearForm() {
    const firmId = this.stockPriceForm.get('firm_id')?.value;
    const productId = this.stockPriceForm.get('product_id')?.value;
    this.stockPriceForm.reset({
      subunit_price: this.totalPurchasePrice,
      l_unit_type: 'GM (Gram)',
      w_type: 'GM',
      m_type: 'GM',
      type: 'GM',
    });
    this.stockPriceForm.patchValue({
      firm_id: firmId,
      product_id: productId,
      user_id: this.getCurrentUserId()
    });
    this.showPriceSubmitButton = true;
    this.showPriceUpdateButton = false;
  }

  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '';
  }

  getCurrentProductId(): number | null {
    const id = localStorage.getItem('createdProductId');
    return id ? Number(id) : null;
  }

  getCurrentProductData() {
    this.stockGeneralService.getProductById(localStorage.getItem('createdProductId')).subscribe((respone: any) => {
      this.newlyCreatedProduct = respone.data;
    })
  }

  goToFeatureTab() {
    this.tabCommService.setActiveTab(4);
  }

  getPriceDetails() {
    const productId = this.getCurrentProductId();
    if (!productId) {
      console.warn('No product ID found.');
      return;
    }
    const params = new HttpParams().set('product_id', productId);
    this.stockPriceService.getStocksPrice(params).subscribe((response: any) => {
      if (response?.data?.length) {
        this.priceDetails = response.data.filter((item: any) => item.product_id === productId);
      } else {
        this.priceDetails = [];
        console.warn('No price data found.');
      }
    });
  }

  patchPriceDetails(id: any) {
    this.stockPriceService.getStockPrice(id).subscribe((response: any) => {
      this.stockPriceData = response.data;
      this.priceId = this.stockPriceData.id;
      this.stockPriceForm.patchValue(this.stockPriceData);
      this.showPriceSubmitButton = false;
      this.showPriceUpdateButton = true;
    })
  }

  editPriceData() {
    this.stockPriceService.updateStockPrice(this.priceId, this.stockPriceForm.value).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('Price updated successfully', 'Success');
        this.getPriceDetails();
        this.clearForm();
        this.showPriceSubmitButton = true;
        this.showPriceUpdateButton = false;
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to update price', 'Error');
      }
    });
  }

  deletePriceData(id: any) {
    this.stockPriceService.deleteStocksPrice(id).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('Price deleted successfully', 'Success');
        this.getPriceDetails();
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to delete price', 'Error');
      }
    })
  }

  getIdFromSharedService() {
    return this.sharedProductService.getProductId();
  }

  getAllWastageDataForEdit() {
    const productIdStr = this.getIdFromSharedService();
    if (!productIdStr) return;
    const productId = Number(productIdStr);
    if (isNaN(productId)) {
      console.error('Invalid product ID:', productIdStr);
      return;
    }
    this.stockPriceService.getWestageListByProductId(productId).subscribe((response: any) => {
      this.wastageData = response.data.filter((wastage: any) => wastage.product_id == productId);
      this.getTotalPurchasePrice(productId)
    });
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    const target = keyboardEvent.target as HTMLElement;
    const form = target.closest('form');
    if (!form) return;
    const focusable = Array.from(form.querySelectorAll<HTMLElement>('input, select, textarea, button')).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
    const index = focusable.indexOf(target);
    if (index > -1 && index + 1 < focusable.length) {
      focusable[index + 1].focus();
    }
  }

  metalDataForFilteredPrice: any;
  stoneDataForFilteredPrice: any;
  packagingDataForFilteredPrice: any;
  allDataForFilteredPrice: any;

  getTotalPurchasePrice(id: number): void {
    let total = 0;
    this.metalService.getMetalsByProductId(id).subscribe(
      (response: any) => {
        console.log('Metal Data:', response.data);
        this.metalDataForFilteredPrice = Array.isArray(response?.data)
          ? response.data.filter((metal: any) => metal.product_id === id && metal.include_in_total_price === true) : [];
        const metalDataList = Array.isArray(response?.data)
          ? response.data.filter((metal: any) => metal.product_id === id && metal.include_in_total_price === true).map((item: any) => parseFloat(item.total_price) || 0)
          : [];
        const metalTotal = metalDataList.reduce((sum: number, val: number) => sum + val, 0);
        total += metalTotal;
        this.updateTotalPurchasePrice(total);
      },
      (error: any) => { console.error('Failed to fetch metal list:', error); }
    );

    this.productservice.getStonesByProductId(id).subscribe(
      (response: any) => {
        this.stoneDataForFilteredPrice = Array.isArray(response?.data)
          ? response.data.filter((stone: any) => stone.product_id === id && stone.include_in_total_price === true) : [];
        const stoneDataList = Array.isArray(response?.data)
          ? response.data.filter((stone: any) => stone.product_id === id && stone.include_in_total_price === true).map((item: any) => parseFloat(item.total_price) || 0)
          : [];
        const stoneTotal = stoneDataList.reduce((sum: number, val: number) => sum + val, 0);
        total += stoneTotal;
        this.updateTotalPurchasePrice(total);
      },
      (error: any) => { console.error('Failed to fetch stone list:', error); }
    );

    this.packagingService.getPackagingListByProductId(id).subscribe(
      (response: any) => {
        this.packagingDataForFilteredPrice = Array.isArray(response?.data)
          ? response.data.filter((p: any) => p.product_id === id && p.include_in_total_price === true) : [];
        const packagingDetail = Array.isArray(response?.data)
          ? response.data.filter((p: any) => p.product_id === id && p.include_in_total_price === true).map((item: any) => parseFloat(item.total_price) || 0)
          : [];
        const packagingTotal = packagingDetail.reduce((sum: number, val: number) => sum + val, 0);
        total += packagingTotal;
        this.updateTotalPurchasePrice(total);
      },
      (error: any) => { console.error('Failed to fetch packaging list:', error); }
    );
  }

  getFinalPriceDetails(id: number): void {
    this.stockPriceService.getPriceDataByProductId(id).subscribe(
      (response: any) => {
        this.priceDataForFinalValue = response.data.reverse()[0];
        console.log('Price Data for Final Value:', this.priceDataForFinalValue);
      },
      (error: any) => {
        console.error('Failed to fetch price data:', error);
      }
    );
  }

  totalPurchasePrice: any;
  updateTotalPurchasePrice(value: number): void {
    this.totalPurchasePrice = value;
    this.stockPriceForm.patchValue({ subunit_price: this.totalPurchasePrice })
  }

}
