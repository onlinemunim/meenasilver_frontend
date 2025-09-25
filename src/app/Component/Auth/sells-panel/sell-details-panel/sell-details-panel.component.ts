import { NotificationService } from './../../../../Services/notification.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Datepicker, initFlowbite } from 'flowbite';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { StockDetailService } from '../../../../Services/Stock-Details/stock-detail.service';
import { UserCustomerService } from '../../../../Services/User/Customer/user-customer.service';
import { StockOutService } from '../../../../Services/Stock_Transactions/Stock_out/stock-out.service';
import { FirmService } from '../../../../Services/firm.service';
import { ReadyProductService } from '../../../../Services/Ready-Product/ready-product.service';
import { HttpParams } from '@angular/common/http';
import { filter } from 'rxjs';
@Component({
  selector: 'app-sell-details-panel',
  standalone: true,
  imports: [
    NgFor,
    ReactiveFormsModule,
    FormsModule,
    NgIf,


  ],
  templateUrl: './sell-details-panel.component.html',
  styleUrls: ['./sell-details-panel.component.css'],
  providers: [DatePipe]

})
export class SellDetailsPanelComponent implements OnInit {

  isProductDetailsVisible = false;

  stoneForms: number[] = [];
  private nextStoneId = 0;
  activeTab: 'add' | 'return' | null = null;
  addProductForm!: FormGroup;
  sellProductForm!: FormGroup;
  customerId : any;
  barcodeList: any[] = [];
  filteredBarcodes: { barcode: string; productCode: string; quantity:string; weight:string; finalValue:string }[] = [];
  selectedIndex = -1;
  customerDetails: any;
  selectedProductCode: string = '';
  selectedQuantity:any;
  selectedFinalValue:any;
  isDropdownVisible = false;
  detailsForm: FormGroup;
  selectedFirm: any;
  selectedWt: any;

  constructor(
    private fb: FormBuilder,
    private notificationService:NotificationService,
    private activatedRoute: ActivatedRoute,
    private stockDetailService:StockDetailService,
    private router:Router,
    private datePipe: DatePipe,
    private userCustomerService:UserCustomerService,
    private stockOutService: StockOutService,
    private firmService: FirmService,
    private readyProductService:ReadyProductService
    )
     {
    this.detailsForm = this.fb.group({
      addDetail: [false],
      addEcom: [false],
      fixMrp: [false]
    });
  }

  ngOnInit(): void {
    this.customerId = this.activatedRoute.snapshot.paramMap.get('id');

    this.getCustomerDetails();
    this.getInvoiceNumber();

    this.addProductForm = this.fb.group({
      start_range_1: ['']
    });


    this.initSellProductForm();
    this.setDate();
    initFlowbite();
    this.addStoneForm();
  }

  getBarcodeFromPaymentPanel(){
    this.stockOutService.getBarcode().pipe(
      filter((barcodeData): barcodeData is string => barcodeData !== null)
    ).subscribe(barcode => {

      this.addProductForm.patchValue({
        'start_range_1' : barcode
      });
      this.isProductDetailsVisible = true;
      this.sellProductForm.get('stout_barcode')?.patchValue(barcode);
      const selectedItem = this.barcodeList.find(item => item.barcode === barcode);

      if (selectedItem) {
        this.selectedProductCode = selectedItem.productCode;
        this.selectedQuantity = selectedItem.quantity;
        this.selectedWt = selectedItem.weight;
        this.selectedFinalValue = selectedItem.finalValue;

        this.onGoClick('add', this.selectedProductCode, this.selectedQuantity, this.selectedWt, this.selectedFinalValue);
      } else {
        // this.notificationService.showError('Barcode not found in stock list', 'Error');
      }
    });
  }

  setDate()
  {

    const today = new Date();
    const formattedToday = this.datePipe.transform(today, 'yyyy-MM-dd');
    this.sellProductForm.patchValue({
      stout_bill_date: formattedToday,
      stout_sale_month: formattedToday
    });

    this.getBarcodeData();
    this.loadFirmList();

    this.addProductForm.get('start_range_1')?.valueChanges.subscribe(value => {
      this.filteredBarcodes = this.barcodeList.filter(item =>
        item.barcode.toLowerCase().includes(value?.toLowerCase() || '')
      );
      this.selectedIndex = -1;
    });

    this.addProductForm.get('start_range_1')?.valueChanges.subscribe(value => {
      this.sellProductForm.patchValue({ barcode: value });
    });
  }

  loadFirmList() {
    this.firmService.getFirms().subscribe((res: any) => {
      this.firmTypes = res.data;
    });
  }

  initSellProductForm() {
    this.sellProductForm = this.fb.group({
      stout_bill_date: [''],
      stout_customer_name: [''],
      stout_billing_name: [''],
      stout_invoice_number: [''],
      stout_firm_id: ['1'],
      stout_account: [''],
      stout_sale_executive: [''],
      stout_sale_month: [''],
      stout_metal_type: ['Silver'],
      stout_item_category: [''],
      stout_item_name: [''],
      stout_product: [''],
      stout_item_code: [''],
      stout_quantity: [''],
      stout_gs_weight: [''],
      stout_gs_wt_unit: [''],
      stout_less_weight: [''],
      stout_less_wt_unit: [''],
      stout_pkt_weight: [''],
      stout_pkt_wt_unit: [''],
      stout_net_weight: [''],
      stout_net_wt_unit: [''],
      stout_tag_weight: [''],
      stout_purity: ['92.5'],
      stout_cust_wastage_weight: [''],
      stout_f_pur: [''],
      stout_v_a: [''],
      stout_fine_weight: [''],
      stout_v_a_wt: [''],
      stout_final_fine_weight: [''],
      stout_cgst_percent: [''],
      stout_cgst_amt: [''],
      stout_sgst_percent: [''],
      stout_sgst_charge: [''],
      stout_igst_percent: [''],
      stout_igst_charge: [''],
      stout_unit_price: [''],
      stout_hsn_no: ['7108'],
      stout_hallmark_uid: [''],
      stout_total_hallmarking_charges: [''],
      stout_other_info: [''],
      stout_model_no: [''],
      stout_counter_name: [''],
      stout_other_charges: [''],
      stout_other_charges_unit: [''],
      stout_making_charges: [''],
      stout_mk_charge_unit: [''],
      stout_metal_rate: [''],
      stout_metal_discount_amount: [''],
      stout_final_amount: [''],
      barcode : [''],
      stout_status: 'pending_invoice',
      stout_barcode: [''],
      stout_customer_id: [this.customerId],
    });
  }

  submitForm(){
    this.stockOutService.createStockOutEntry(this.sellProductForm.value).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('Stock Out Entry Created Successfully', 'Success');
        this.router.navigate(['/payment-details', this.customerId], {
          queryParams: { refresh: true }
        });
      },
      error: (error: any) => {
        console.error('Error creating Stock Out Entry:', error);
        this.notificationService.showError('Failed to create Stock Out Entry', 'Error');
      }
    });
  }

  showProductDetails(): void {
    this.isProductDetailsVisible = true;
  }
  addStoneForm(): void {
    this.stoneForms.push(this.nextStoneId++);
  }

  removeStoneForm(idToRemove: number): void {
    this.stoneForms = this.stoneForms.filter(id => id !== idToRemove);
  }

  onGoClick(type: 'add' | 'return', productCode?: string, quantity?: string, weight?:string, finalValue?:string) {
    const barcodeValue = this.addProductForm.get('start_range_1')?.value;

    if (!barcodeValue) {
      this.notificationService.showError('Please select a barcode first!', 'Error');
      return;
    }
    this.sellProductForm.patchValue({
      barcode: barcodeValue
    });

    // Patch customer name if available
    if (this.customerDetails?.name) {
      this.sellProductForm.patchValue({
        stout_customer_name: this.customerDetails.name,
        stout_billing_name: this.customerDetails.name
      });
    }

    this.getProductCodeData(productCode, quantity, weight, finalValue);
    this.activeTab = type;
    this.isProductDetailsVisible = true;
  }


  getProductCodeData(itemCode:any,quantity:any,weight:any,finalValue:any){

    const params = new HttpParams().append('product_code', itemCode);
    this.readyProductService.getReadyProducts(params).subscribe((response:any)=>{
      const product = response.data[0];

      this.sellProductForm.patchValue({
        stout_item_category: product.rproduct_categories?.name,
        stout_item_name: product.rproduct_name,
        // stout_product: product.rproduct_id,
        stout_item_code: product.rproduct_code,
        stout_quantity: quantity,
        stout_net_weight: weight,
        stout_tag_weight: weight,
        stout_net_wt_unit: product.rproduct_unit,
        // stout_other_charges: product.rproduct_other_expense_per_gm,
        // stout_making_charges: product.rproduct_per_gram_labour,
        // stout_metal_rate: product.rproduct_silver_rate_per_gm,
        stout_final_amount: finalValue,
        stout_unit_price : (Number(finalValue)/Number(weight)),
      });
    })
  }


  getCustomerDetails() {
    this.userCustomerService.getUserCustomerById(this.customerId).subscribe({
      next: (response: any) => {
        this.customerDetails = response.data;
        this.getBarcodeData();
      },
      error: (error: any) => {
        console.error('Error fetching customer details:', error);
        this.notificationService.showError('Failed to fetch customer details', 'Error');
      }
    });
  }

  getInvoiceNumber(){
    this.stockOutService.getInvoiceNumber(this.customerId).subscribe((response:any)=>{
      this.sellProductForm.patchValue({
        stout_invoice_number: response.invoice_number
      });
    });
  }

  getBarcodeData() {
    let params: HttpParams;
    if (this.customerDetails?.user_customer_type === "Wholesale" ||
        this.customerDetails?.user_customer_type === "Retailer") {
      params = new HttpParams().set('std_product_type', 'lot-wise');
    } else {
      params = new HttpParams().set('std_product_type', 'piece-wise');
    }

    this.stockDetailService.getStockDetails(params).subscribe({
      next: (response: any) => {
        this.barcodeList = response.data
          .filter((item: any) => item.stock_status !== 'sold')
          .map((item: any) => ({
            barcode: item.std_barcode,
            productCode: item.std_item_code,
            quantity: item.std_quantity,
            weight: item.std_total_wt,
            finalValue: item.std_unit_price,
          }));

        this.getBarcodeFromPaymentPanel();
      },
      error: (error: any) => {
        console.error('Error fetching barcode data:', error);
      }
    });
  }

  onSelectBarcode(barcode: string) {
    this.sellProductForm.get('stout_barcode')?.patchValue(barcode);
    const selectedItem = this.filteredBarcodes.find(item => item.barcode === barcode);
    if (selectedItem) {
      this.selectedProductCode = selectedItem.productCode;
      this.selectedQuantity = selectedItem.quantity;
      this.selectedWt = selectedItem.weight;
      this.selectedFinalValue = selectedItem.finalValue;

      this.addProductForm.get('start_range_1')?.setValue(barcode);

      this.onGoClick(
        this.activeTab ?? 'add',
        this.selectedProductCode,
        this.selectedQuantity,
        this.selectedWt,
        this.selectedFinalValue
      );
    }

    this.filteredBarcodes = [];
    this.isDropdownVisible = false;
  }


  onFocusInput() {
    this.filteredBarcodes = [...this.barcodeList];
    this.selectedIndex = -1;
    this.isDropdownVisible = true;
  }

  onBlurInput(): void {
    setTimeout(() => {
      this.isDropdownVisible = false;
    }, 200);
  }


  onKeyDown(event: KeyboardEvent) {
    const maxIndex = this.filteredBarcodes.length - 1;

    if (event.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) > maxIndex ? 0 : this.selectedIndex + 1;
      event.preventDefault();
    }
    else if (event.key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex - 1) < 0 ? maxIndex : this.selectedIndex - 1;
      event.preventDefault();
    }
    else if (event.key === 'Enter' && this.selectedIndex >= 0) {
      this.onSelectBarcode(this.filteredBarcodes[this.selectedIndex].barcode);
      event.preventDefault();
    }
  }

  // for Firm
  firmTypes: { id: number; name: string }[] = [];
  selectedFirmType: string = '';



  brandSeller: string[] = ['brand 1', 'brand 2', 'brand 3'];
  selectedBrandseller: string = 'brand 1';

  // for unit
  unitTypes: string[] = ['GM', 'KG', 'MG'];
  selectedUnit: string = '';
  selectedLessWtUnit: string = '';
  selectedPktWtUnit: string = '';
  selectedNetWtUnit: string = '';

  selectedMakingChargesUnit: string = '';
  selectedLabChargesUnit: string = '';
  selectedHMChargesUnit: string = '';
  selectedOtherChargesUnit: string = '';
}
