import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initFlowbite } from 'flowbite';
import { CustomSelectComponent } from '../../../../Core/custom-select/custom-select.component';
import { CommonModule, NgFor } from '@angular/common';
import { StockDetailService } from '../../../../../Services/Stock-Details/stock-detail.service';
import { StockOutService } from '../../../../../Services/Stock_Transactions/Stock_out/stock-out.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserCustomerService } from '../../../../../Services/User/Customer/user-customer.service';
import { HttpParams } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StockService } from '../../../../../Services/Stock/stock.service';
import { FirmSelectionService } from '../../../../../Services/firm-selection.service';
import { NotificationService } from '../../../../../Services/notification.service';
import { InvoiceService } from '../../../../../Services/Invoice/invoice.service';

// NOTE: This interface can be removed if not used elsewhere, as the form dictates the structure.
export interface InvoiceItem {
  itId: string;
  metal: string;
  itemDet: string;
  qty: number;
  gsWt: number;
  ntWt: number;
  purity: string;
  wstg: number;
  fnPurity: number;
  custWstg: string;
  ffineWt: number;
  valAdd: string;
  mkgChrgs: number;
  othChrgs: number;
  totMkgChrgs: number;
  amt: number;
  mkgDisc: string;
  disc: string;
  val: number;
  cryVal: string;
  totHmc: string;
  totTax: string;
  finalVal: number;
  mrp: number;
  status: string;
}

@Component({
  selector: 'app-payment-panel',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    CustomSelectComponent,
    NgFor,
    RouterLink
  ],
  templateUrl: './payment-panel.component.html',
  styleUrls: ['./payment-panel.component.css']
})
export class PaymentPanelComponent implements OnInit {

  stoneForms: number[] = [];
  private nextStoneId = 0;
  private firmId: number | null = null;

  detailsForm!: FormGroup;
  metalDetailsForm!: FormGroup;
  paymentDetailsForm!: FormGroup;
  addProductForm!: FormGroup;
  filteredBarcodes: { barcode: string; productCode: string; quantity:string; weight:string; finalValue:string }[] = [];
  barcodeList: any[] = [];
  selectedIndex = -1;
  customerId:any;
  customerDetails:any;
  invoiceItem:any;
  metalReceivedData:any;
  invoiceId!:number;
  customerType!: String;

  public isRateCutEnabled = false;
  public showCashSection = true;
  public hovered: 'rate' | 'no-rate' | 'cash' | null = null;

  // Summary object for display on the right panel.
  // Values will be updated by calculateSummary()
  public summary = {
    previousAmount: 0.00,
    amount: 0.00,
    totalAmountBeforeDisc: 0.00,
    discount: 0.00,
    taxableAmount: 0.00,
    cgst: 0.00,
    sgst: 0.00,
    courierCharges: 0.00,
    roundOff: 0.00,
    grandTotal: 0.00,
    metalReceived: 0.00,
    amountPaid: 0.00,
    loyaltyAmount: 0.00,
    finalCashDeposit: 0.00
  };

  public accountTypes: string[] = ['RAW ALLOY', 'RAW GOLD', 'RAW METAL', 'RAW SILVER', 'STOCK (INVENTORY)'];
  metalTypes: string[] = ['Silver'];
  firmTypes: string[] = ['firm 1', 'firm 2', 'firm 3', 'firm 4'];
  brandSeller: string[] = ['brand 1', 'brand 2', 'brand 3'];
  unitTypes: string[] = ['GM', 'KG', 'MG', 'CT'];

  public activeTabs: { [key: string]: string } = {
    gold: 'metal',
    silver: 'metal',
    stone: 'stone'
  };

  constructor(
    private fb: FormBuilder,
    private stockDetailService:StockDetailService,
    private stockOutService:StockOutService,
    private router:Router,
    private userCustomerService:UserCustomerService,
    private notificationService:NotificationService,
    private route:ActivatedRoute,
    private stockService:StockService,
    private firmSelectionService:FirmSelectionService,
    private invoiceService:InvoiceService
  ) {}

  ngOnInit(): void {
    initFlowbite();
    this.initializeForms();
    this.initPaymentDetailsForm();
    this.loadInitialData();
    this.initMetalReceivedForm();

    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      if (firm && firm.id) {
        this.firmId = firm.id;
        this.metalDetailsForm.patchValue({
          st_firm_id: firm.id
        });
        this.paymentDetailsForm.patchValue({
          in_firm_id : firm.id
        })
      }
    });

    this.paymentDetailsForm.valueChanges.subscribe(() => {
        this.calculateSummary();
    });
  }

  initMetalReceivedForm() {
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();

    this.metalDetailsForm = this.fb.group({
      st_metal_type: ['Silver'],
      st_firm_id: [''],
      st_account: [''],
      st_descreption: [''],
      st_item_name: [''],
      st_gs_weight: [''],
      st_gs_weight_type: ['GM'],
      st_less_weight: [''],
      st_less_weight_type: ['GM'],
      st_net_weight: [null],
      st_net_weight_type: ['GM'],
      st_tunch: ['92.5'],
      st_fine_weight: [''],
      st_lbr_weight: [''],
      st_ffn_weight: [''],
      st_metal_rate: [null],
      st_valuation: [null],
      st_avg_metal_rate: [''],
      st_item_category: [''],
      st_item_code: [`MRCODE_${randomCode}`],
      st_type: ['metal_received'],
      st_invoice_number: [''],
      st_purity: [92.5]
    });

    this.metalDetailsForm.get('st_item_name')?.valueChanges.subscribe(name => {
      this.metalDetailsForm.get('st_item_category')?.setValue(name, { emitEvent: false });
    });

    const netWtControl = this.metalDetailsForm.get('st_net_weight');
    const rateControl = this.metalDetailsForm.get('st_metal_rate');

    if(netWtControl && rateControl) {
        netWtControl.valueChanges.subscribe(() => this.calculateMetalReceivedValue());
        rateControl.valueChanges.subscribe(() => this.calculateMetalReceivedValue());
    }

    if (this.invoiceItem && this.invoiceItem.length > 0) {
      this.metalDetailsForm.patchValue({
        st_invoice_number: this.invoiceItem[0].stout_invoice_number
      });
    }
  }

  calculateMetalReceivedValue(): void {
      const netWt = parseFloat(this.metalDetailsForm.get('st_net_weight')?.value) || 0;
      const rate = parseFloat(this.metalDetailsForm.get('st_metal_rate')?.value) || 0;
      const value = netWt * rate;
      this.metalDetailsForm.get('st_valuation')?.setValue(value.toFixed(2), { emitEvent: false });
  }

  initPaymentDetailsForm(){
    this.paymentDetailsForm = this.fb.group({
        // UI Control Toggles (not in database)
        isCgstSgstApplicable: [true],
        isMetalExchangeApplicable: [false],

        // Transaction & Sales Person
        amountPaidReceiveOption: ['amountReceived'],
        in_salesperson_name: [''],

        // Discount Section
        in_discount_narration: [''],
        in_discount_coupon: [''],
        in_discount_percent: [''], // UI helper, not in DB
        in_total_discount: [''],

        // Courier Section
        in_courier_charges: [0],
        in_courier_info: [''],

        // Tax Section (Percentages are UI helpers)
        in_cgst_percent: [1.5],
        in_sgst_percent: [1.5],
        in_cgst: [{ value: 0, disabled: true }],
        in_sgst: [{ value: 0, disabled: true }],

        // Payment Methods: Cash
        in_payment_account_cash: ['2893'],
        in_cash_narration: [''],
        in_cash_amount: [0],

        // Payment Methods: Bank
        in_payment_account_bank: ['2892'],
        in_cheque_narration: [''], // Corresponds to Cheque/NEFT/IMPS field
        in_bank_amount: [0],

        // Payment Methods: Card
        in_payment_account_card: ['2951'],
        in_card_number: [''],
        in_card_amount: [''],
        in_card_charges_percent: [''],
        in_card_charges_amount: [''],
        in_total_card_amount: [0],

        // Payment Methods: Online
        in_payment_account_online: ['2952'],
        in_online_narration: [''],
        in_online_amount: [''],
        in_online_commission_percent: [''], // UI helper, not in DB
        in_online_commission_amount: [''],  // UI helper, not in DB
        in_total_online_amount: [0],

        // Loyalty Points Section
        in_loyalty_account_id: ['2924'], // UI helper, not in DB
        loyaltyOpening: [''],
        loyaltyClosing: [''],
        loyaltyGain: [''],
        in_loyalty_amount: [0],

        // Other Info Section
        in_notes: [''], // Corresponds to "Payment Other Info"
        reminder: ['NotSelected'],
        in_firm_id:[''],

        // All other summary fields that are calculated and stored
        in_previous_amount: [0],
        in_sub_total: [{ value: 0, disabled: true }],
        in_total_amount_before_disc: [{ value: 0, disabled: true }],
        in_taxable_amount: [{ value: 0, disabled: true }],
        in_round_off: [0],
        in_grand_total: [{ value: 0, disabled: true }],
        in_metal_received: [{ value: 0, disabled: true }],
        in_amount_paid: [{ value: 0, disabled: true }],
        in_final_cash_deposit: [{ value: 0, disabled: true }],
        in_balance_due: [{ value: 0, disabled: true }],
    });
  }

  addReceivedMetal() {
    this.stockService.createStockEntry(this.metalDetailsForm.value).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess("Metal received entry added successfully!","Success");
        this.getMetalReceivedData();
        this.clearMetalReceivedForm();
      },
      error: (error: any) => {
        console.error("Error while adding metal entry:", error);
        this.notificationService.showError("Failed to add metal entry. Please try again.", "Error");
      }
    });
  }

  getMetalReceivedData(){
    const params = new HttpParams().set('invoice_number', this.invoiceItem[0]?.stout_invoice_number);
    this.stockService.getStockEntriesWithParams(params).subscribe((response:any)=>{
      this.metalReceivedData = response.data;
      this.calculateSummary();
    });
  }

  deleteReceivedMetal(id: any) {
    this.stockService.deleteStockEntry(id).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess("Metal entry deleted successfully!", "Success");
        this.getMetalReceivedData();
      },
      error: (error: any) => {
        console.error("Error while deleting metal entry:", error);
        this.notificationService.showError("Failed to delete metal entry. Please try again.", "Error");
      }
    });
  }

  deleteInvoiceItem(itemId: number): void {
    if (!confirm('Are you sure you want to remove this item from the invoice?')) {
      return;
    }

    this.stockOutService.deleteStockOutEntry(itemId).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Item removed and stock rolled back successfully!', 'Success');

        // Refresh the UI efficiently
        // Find the index of the item to remove
        const index = this.invoiceItem.findIndex((item: any) => item.stout_id === itemId);
        if (index > -1) {
          // Remove the item from the local array
          this.invoiceItem.splice(index, 1);
          // Recalculate the summary
          this.calculateSummary();
        } else {
          // Fallback to a full reload if the item isn't found locally for some reason
          this.loadInitialData();
        }
      },
      error: (err) => {
        console.error('Error deleting stock out entry:', err);
        const errorMessage = err.error?.message || 'Failed to remove item. Please try again.';
        this.notificationService.showError(errorMessage, 'Error');
      }
    });
  }

  clearMetalReceivedForm(){
    const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.metalDetailsForm.reset({
      st_metal_type: 'Silver',
      st_type: 'metal_received',
      st_purity: 92.5,
      st_tunch: 92.5,
      st_gs_weight_type: 'GM',
      st_less_weight_type: 'GM',
      st_net_weight_type: 'GM',
      st_item_code: `MRCODE_${randomCode}`,
    })
    if (this.invoiceItem && this.invoiceItem.length > 0) {
      this.metalDetailsForm.patchValue({
        st_invoice_number: this.invoiceItem[0].stout_invoice_number
      });
    }
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      if (firm && firm.id) {
        this.metalDetailsForm.patchValue({
          st_firm_id: firm.id
        });
      }
    });
  }

  private initializeForms(): void {
    this.addStoneForm();
    this.detailsForm = this.fb.group({
      addDetail: [false],
      addEcom: [false],
      fixMrp: [false]
    });
    this.initSelectBarcodeForm();
  }

  private loadInitialData(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.customerId = params.get('id');
        if (!this.customerId) {
          this.notificationService.showError('No Customer ID found in URL.', 'Error');
          return [];
        }
        return this.getCustomerDetailsObservable();
      }),
      switchMap((customerResp: any) => {
        this.customerDetails = customerResp.data;
        this.customerType = this.customerDetails?.user_customer_type;

        const barcodeObs = this.getBarcodeDataObservable();
        const invoiceObs = this.getInvoiceItemsObservable();
        return forkJoin({
          invoiceItems: invoiceObs,
          barcodeData: barcodeObs,
          customerDetails: Promise.resolve(customerResp) as any
        });
      })
    ).subscribe({
      next: (response) => {
        this.invoiceItem = response.invoiceItems.data;
        this.barcodeList = this.processBarcodeData(response.barcodeData.data);

        if (this.customerDetails && this.customerDetails.balance_due) {
          const previousAmount = parseFloat(this.customerDetails.balance_due);
          this.paymentDetailsForm.patchValue({
            in_previous_amount: previousAmount.toFixed(2)
          });
        } else {
        }

        if (this.invoiceItem && this.invoiceItem.length > 0) {
          this.metalDetailsForm.patchValue({
            st_invoice_number: this.invoiceItem[0].stout_invoice_number
          });
          this.getMetalReceivedData();
        } else {
          this.calculateSummary();
        }
      },
      error: (err) => {
        console.error('Error fetching initial data', err);
        this.notificationService.showError('Failed to load page data.', 'Error');
      }
    });
  }

  calculateSummary(): void {
    const form = this.paymentDetailsForm.getRawValue();

    // 1. Get base values from the form and invoice items
    const subTotal = this.finalValuation;
    const previousAmount = parseFloat(form.in_previous_amount) || 0;
    const discount = parseFloat(form.in_total_discount) || 0;
    const courierCharges = parseFloat(form.in_courier_charges) || 0;
    // We will get roundOff from the form later, but calculate it first.

    let taxableAmount = 0;
    let cgst = 0;
    let sgst = 0;
    let totalAmountBeforeDisc = 0;

    // 2. Conditional Tax Calculation Logic
    if (form.isCgstSgstApplicable) {
      const cgstPercent = parseFloat(form.in_cgst_percent) || 0;
      const sgstPercent = parseFloat(form.in_sgst_percent) || 0;
      const totalTaxRate = (cgstPercent + sgstPercent) / 100;
      const divisor = 1 + totalTaxRate;
      const preTaxBaseAmount = subTotal / divisor;
      taxableAmount = preTaxBaseAmount - discount;
      cgst = taxableAmount * (cgstPercent / 100);
      sgst = taxableAmount * (sgstPercent / 100);
      totalAmountBeforeDisc = previousAmount + subTotal;
    } else {
      totalAmountBeforeDisc = previousAmount + subTotal;
      taxableAmount = totalAmountBeforeDisc - discount;
      cgst = 0;
      sgst = 0;
    }

    // 3. *** NEW ROUNDING LOGIC ***
    const totalBeforeRounding = previousAmount + taxableAmount + cgst + sgst + courierCharges;
    const roundedTotal = Math.round(totalBeforeRounding); // Standard rounding (e.g., 13207.32 -> 13207, 13207.72 -> 13208)
    const roundOff = roundedTotal - totalBeforeRounding;

    // The final grand total is the rounded amount.
    const grandTotal = roundedTotal;
    // *** END OF NEW ROUNDING LOGIC ***


    // 4. Calculate payments and balances
    const metalReceived = form.isMetalExchangeApplicable ? this.totalMetalReceivedValue : 0;
    const loyaltyAmount = parseFloat(form.in_loyalty_amount) || 0;
    const cashPaid = parseFloat(form.in_cash_amount) || 0;
    const bankPaid = parseFloat(form.in_bank_amount) || 0;
    const cardPaid = parseFloat(form.in_total_card_amount) || 0;
    const onlinePaid = parseFloat(form.in_total_online_amount) || 0;
    const amountPaid = cashPaid + bankPaid + cardPaid + onlinePaid;
    const balanceDue = grandTotal - metalReceived - amountPaid - loyaltyAmount;

    // 5. Update the summary object for display
    this.summary = {
      previousAmount: previousAmount,
      amount: subTotal,
      totalAmountBeforeDisc: totalAmountBeforeDisc,
      discount: discount,
      taxableAmount: taxableAmount,
      cgst: cgst,
      sgst: sgst,
      courierCharges: courierCharges,
      roundOff: roundOff, // Use the calculated roundOff value here
      grandTotal: grandTotal,
      metalReceived: metalReceived,
      amountPaid: amountPaid,
      loyaltyAmount: loyaltyAmount,
      finalCashDeposit: balanceDue
    };

    // 6. Patch all calculated values back into the form
    this.paymentDetailsForm.patchValue({
      in_sub_total: subTotal.toFixed(2),
      in_total_amount_before_disc: totalAmountBeforeDisc.toFixed(2),
      in_taxable_amount: taxableAmount.toFixed(2),
      in_cgst: cgst.toFixed(2),
      in_sgst: sgst.toFixed(2),
      in_round_off: roundOff.toFixed(2), // Patch the calculated roundOff value
      in_grand_total: grandTotal.toFixed(2),
      in_metal_received: metalReceived.toFixed(2),
      in_amount_paid: amountPaid.toFixed(2),
      in_final_cash_deposit: balanceDue.toFixed(2),
      in_balance_due: balanceDue.toFixed(2)
    }, { emitEvent: false });
  }

  private processBarcodeData(data: any[]): any[] {
    return data
      .filter((item: any) => item.stock_status !== 'sold')
      .map((item: any) => ({
        barcode: item.std_barcode,
        productCode: item.std_item_code,
        quantity: item.std_quantity,
        weight: item.std_total_wt,
        finalValue: item.std_unit_price,
      }));
  }

  private getInvoiceItemsObservable(): Observable<any> {
    const params = new HttpParams()
      .set('customer_id', this.customerId)
      .set('invoice_status', 'pending_invoice');
    return this.stockOutService.getStockOutEntries(params);
  }

  private getBarcodeDataObservable(): Observable<any> {
    if(this.customerDetails?.user_customer_type === "Wholesale" || this.customerDetails?.user_customer_type === "Retailer"){
      const params = new HttpParams().set('std_product_type', 'lot-wise');
      return this.stockDetailService.getStockDetails(params);
    }else{
      const params = new HttpParams().set('std_product_type', 'piece-wise');
      return this.stockDetailService.getStockDetails(params);
    }
  }

  private getCustomerDetailsObservable(): Observable<any> {
    return this.userCustomerService.getUserCustomerById(this.customerId);
  }

  setActiveTab(commodity: string, tab: string): void {
    this.activeTabs[commodity] = tab;
  }

  addStoneForm(): void { this.stoneForms.push(this.nextStoneId++); }
  removeStoneForm(idToRemove: number): void { this.stoneForms = this.stoneForms.filter(id => id !== idToRemove); }

  goToCashDetails(): void {
    this.isRateCutEnabled = false;
    this.showCashSection = true;
  }

  getBarcodeData() {
    const params = new HttpParams();
    this.stockDetailService.getStockDetails(params).subscribe({
      next: (response: any) => {
        this.barcodeList = response.data
          .filter((item: any) => item.stock_status !== 'sold')
          .map((item: any) => ({
            barcode: item.std_barcode,
            productCode: item.std_item_code,
            quantity : item.std_quantity,
            weight : item.std_total_wt,
            finalValue : item.std_unit_price,
          }));
      },
      error: (error: any) => {
        console.error('Error fetching barcode data:', error);
      }
    });
  }

  initSelectBarcodeForm(){
    this.addProductForm = this.fb.group({
      start_range_1: ['']
    });
  }

  onFocusInput() {
    this.filteredBarcodes = [...this.barcodeList];
    this.selectedIndex = -1;
  }

  onBlurInput(): void {
    setTimeout(() => {
      this.filteredBarcodes = [];
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

  onSelectBarcode(barcode: string) {
    this.addProductForm.get('start_range_1')?.setValue(barcode);
    this.filteredBarcodes = [];
  }

  onGoClick(type: 'add' | 'return') {
    const barcode = this.addProductForm.get('start_range_1')?.value;
    this.stockOutService.setBarcode(barcode);
    setTimeout(() => {
      if(this.customerDetails?.user_customer_type === "Wholesale" || this.customerDetails?.user_customer_type === "Retailer"){
        this.router.navigate(['sell-details-lot',this.customerId]);
      }else{
        this.router.navigate(['sell-details',this.customerId]);
      }
    }, 0);
  }

  get totalQty(): number {
    return this.invoiceItem?.reduce((sum: number, item: { stout_quantity: any; }) => sum + (Number(item.stout_quantity) || 0), 0) || 0;
  }

  get totalWeight(): number {
    return this.invoiceItem?.reduce((sum: number, item: { stout_total_wt: any; }) => sum + (Number(item.stout_total_wt) || 0), 0) || 0;
  }

  get finalValuation(): number {
    return this.invoiceItem?.reduce((sum: number, item: { stout_final_amount: any; }) => sum + (Number(item.stout_final_amount) || 0), 0) || 0;
  }

  get totalMetalReceivedValue(): number {
    return this.metalReceivedData?.reduce((sum: number, item: { st_valuation: any; }) => sum + (Number(item.st_valuation) || 0), 0) || 0;
  }

  storeInvoiceData(action: 'save' | 'print' = 'save') {
    const invoicePayload = {
      ...this.paymentDetailsForm.getRawValue(),
      in_invoice_number: this.invoiceItem[0]?.stout_invoice_number || `INV-${Date.now()}`,
      in_customer_id: this.customerId,
      in_customer_name: this.customerDetails?.name,
      in_billing_name: this.customerDetails?.user_name,
      in_firm_id: this.firmId,
      in_invoice_date: new Date().toISOString().split('T')[0],
    };

    // remove UI-only helpers
    delete invoicePayload.isCgstSgstApplicable;
    delete invoicePayload.isMetalExchangeApplicable;
    delete invoicePayload.in_loyalty_account_id;
    delete invoicePayload.loyaltyOpening;
    delete invoicePayload.loyaltyClosing;
    delete invoicePayload.loyaltyGain;
    delete invoicePayload.amountPaidReceiveOption;
    delete invoicePayload.reminder;

    this.invoiceService.createInvoice(invoicePayload).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess("Invoice created successfully!", "Success");
        this.invoiceId = response.data.id;

        this.getMetalReceivedData();
        this.loadInitialData();
        this.paymentDetailsForm.reset();

        // 👉 handle both cases here
        if (action === 'print') {
          if (this.customerType === "Wholesale" || this.customerType === "Retailer") {
            this.router.navigate([`invoice-b2b/${this.invoiceId}`]);
          } else {
            this.router.navigate([`invoice-panel/${this.invoiceId}`]);
          }
        }
      },
      error: (error: any) => {
        console.error("Error while creating invoice:", error);
        this.notificationService.showError("Failed to create invoice. Please try again.", "Error");
      }
    });
  }

  narrationValue: string = '';
showOptions = false;
options = ["PhonePe", "GPay", "Paytm"];
filteredOptions: string[] = [...this.options];

filterOptions() {
  this.filteredOptions = this.options.filter(opt =>
    opt.toLowerCase().includes(this.narrationValue.toLowerCase())
  );
}

selectOption(option: string) {
  this.narrationValue = option;
  this.showOptions = false;
}

hideOptions() {
  setTimeout(() => this.showOptions = false, 200); // delay so click works
}

}
