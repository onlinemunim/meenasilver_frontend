import { StockGeneralService } from './../../../../Services/Product_Creation/stock-general.service';
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { NotificationService } from '../../../../Services/notification.service';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service';
import { RawStoneService } from '../../../../Services/Raw_Stone/raw-stone.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { StockInService } from '../../../../Services/Stock_Transactions/Stock_in/stock-in.service';

@Component({
  selector: 'app-stone',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CustomSelectComponent,
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './stone.component.html',
  styleUrls: ['./stone.component.css']
})
export class StoneComponent implements OnInit, OnDestroy {
  @ViewChild('imageInput1') imageInput1!: ElementRef;
  @ViewChild('imageInput2') imageInput2!: ElementRef;

  stoneEntryForm!: FormGroup;
  diamondType: string[] = [
    'By Line',
    'By Stone',
    'By Gram',
  ];
  selectedDiamond: string = '';

  sizeType: string[] = [
    'MM',
    'CM',
    'DM',
  ];
  selectedSizeType: string = 'MM';
  imagePreviews: (string | ArrayBuffer | null)[] = [null, null];
  fileUploadError: (string | null)[] = [null, null];
  selectedFiles: (File | null)[] = [null, null];

  selectedFields2: any[] = [];
  calculatedQuantity: number | null = null;
  calculatedPerStonePrice: number | null = null;

  private formValueChangeSubscription: Subscription | null = null;
  private selectedDiamondSubscription: Subscription | null = null;
  currentFirmId: any;
  firmSelectionSubscription: Subscription | null = null;
  prefixData: any;
  stonePrefix: any;
  rawstonelist: any;
  rawStonedata: any;
  submitbutton:boolean= true;
  updatebutton:boolean =false;
  rawStoneId: any;
  rawMetalProductId: any;
  iseditMode: false = false;
  serialCounter:number = 1;
  stoneDataList: any;
  selectedViewMode2: string = 'byLine';

  constructor(
    private fb: FormBuilder,
    private rawMetalService: RawMetalService,
    private notificationService: NotificationService,
    private customizeService:CustomizeService,
    private firmSelectionService: FirmSelectionService,
    private rawstoneservice: RawStoneService,
    private activateroute:ActivatedRoute,
    private stockGeneralService:StockGeneralService,
    private stockInService: StockInService
  ) { }


  ngOnInit(): void {
    this.getCategories();
    const savedMode = localStorage.getItem('stoneViewMode2');
      this.selectedViewMode2 = 'all';
      this.updateSecondTableFields();

    this.rawMetalProductId = this.activateroute.snapshot.params['id'];

    this.firmSelectionSubscription = this.firmSelectionService.selectedFirmName$.subscribe((firm) => {
      if (!firm) return;
      this.currentFirmId = firm.id;

      this.initializeForm();

      this.generatedProductCode = undefined;

      this.imagePreviews = [null, null];
      this.selectedFiles = [null, null];
      this.fileUploadError = [null, null];

      this.getStonePrefix();
      this.getProductCodes();
      this.getCategories();
      this.getStoneList();

      if (this.rawMetalProductId) {
        this.patchdata();
      }
    });
    this.getStoneList();
  }

  private initializeForm(): void {

    if (this.stoneEntryForm) {
      this.formValueChangeSubscription?.unsubscribe();
      this.selectedDiamondSubscription?.unsubscribe();
    }

    this.stoneEntryForm = this.fb.group({
      st_item_category: ['', Validators.required],
      st_item_code: ['', [Validators.required, Validators.maxLength(255)]],
      st_item_name: ['', Validators.required],
      st_item_size: ['', [Validators.required]],
      st_size_type: [this.selectedSizeType],
      st_color: ['', Validators.required],
      st_product_type: ['', Validators.required],
      st_metal_type: '-',
      st_per_Line_price: [''],
      st_stone_in_each_Line: [''],
      st_unit_quantity: [''],

      st_sub_unit_price: [''],

      st_subunit: [''],
      st_total_wt: [''],
      st_unit_price: [''],
      st_purity: ['100'],
      st_product_code_type: ['raw_stone'],

      st_quantity: [{ value: '', disabled: true }],
      st_firm_id: [this.currentFirmId, Validators.required],
    });

    const stNameValue = this.stoneEntryForm.get('st_item_name')?.value;
    this.stoneEntryForm.get('st_item_category')?.setValue(stNameValue);


    this.selectedDiamond = '';
    this.selectedSizeType = 'MM';

    const stTypeControl = this.stoneEntryForm.get('st_product_type');
    this.selectedDiamondSubscription = stTypeControl
      ? stTypeControl.valueChanges.subscribe(value => {
          this.updateFormValidators(value);
          this.performCalculations();
        })
      : null;


    this.updateFormValidators(this.selectedDiamond);
    this.setupLiveCalculations();
  }

  ngOnDestroy(): void {
    this.formValueChangeSubscription?.unsubscribe();
    this.selectedDiamondSubscription?.unsubscribe();
    this.firmSelectionSubscription?.unsubscribe();
  }

  getControl(name: string): AbstractControl {
    return this.stoneEntryForm.controls[name];
  }

  onDiamondSelectionChange(value: string) {
    this.selectedDiamond = value;
    this.stoneEntryForm.get('st_product_type')?.setValue(value, { emitEvent: false });
    this.updateFormValidators(value);
    this.performCalculations();
  }

  onSizeTypeChange(value: string) {
    this.selectedSizeType = value;
    this.stoneEntryForm.get('st_size_type')?.setValue(value);
  }

  updateFormValidators(type: string): void {

    const LineFields = ['st_unit_price', 'st_subunit', 'st_unit_quantity'];
    const gramFields = ['st_subunit', 'st_total_wt', 'st_unit_price'];


    const commonCalculatedOrInputFields = ['st_quantity', 'st_sub_unit_price'];


    const allPotentialInputFields = [
      ...LineFields,
      ...gramFields,
      ...commonCalculatedOrInputFields
    ];

    allPotentialInputFields.forEach(field => {
      const control = this.stoneEntryForm.get(field);
      if (control) {
        control.clearValidators();
        control.disable({ emitEvent: false });
        control.setValue('', { emitEvent: false });
        control.updateValueAndValidity({ emitEvent: false });
      }
    });

    this.stoneEntryForm.get('st_item_category')?.enable({ emitEvent: false });
    this.stoneEntryForm.get('st_item_code')?.enable({ emitEvent: false });
    this.stoneEntryForm.get('st_item_name')?.enable({ emitEvent: false });
    this.stoneEntryForm.get('st_item_size')?.enable({ emitEvent: false });
    this.stoneEntryForm.get('st_size_type')?.enable({ emitEvent: false });
    this.stoneEntryForm.get('st_color')?.enable({ emitEvent: false });
    this.stoneEntryForm.get('st_product_type')?.enable({ emitEvent: false });
    this.stoneEntryForm.get('st_firm_id')?.enable({ emitEvent: false });
    this.stoneEntryForm.get('st_purity')?.enable({ emitEvent: false });
    this.stoneEntryForm.get('st_product_code_type')?.enable({ emitEvent: false });


    switch (type) {
      case 'By Line':
        LineFields.forEach(field => {
          const control = this.stoneEntryForm.get(field);
          if (control) {
            control.setValidators([Validators.required, Validators.min(0.01)]);
            control.enable({ emitEvent: false });
          }
        });

        this.stoneEntryForm.get('st_quantity')?.disable({ emitEvent: false });
        this.stoneEntryForm.get('st_sub_unit_price')?.disable({ emitEvent: false });
        break;

      case 'By Stone':
        this.stoneEntryForm.get('st_quantity')?.setValidators([Validators.required, Validators.min(1)]);
        this.stoneEntryForm.get('st_quantity')?.enable({ emitEvent: false });

        this.stoneEntryForm.get('st_sub_unit_price')?.setValidators([Validators.required, Validators.min(0.01)]);
        this.stoneEntryForm.get('st_sub_unit_price')?.enable({ emitEvent: false });

        LineFields.forEach(field => {
          this.stoneEntryForm.get(field)?.disable({ emitEvent: false });
        });
        gramFields.forEach(field => {
          this.stoneEntryForm.get(field)?.disable({ emitEvent: false });
        });
        break;

      case 'By Gram':
        gramFields.forEach(field => {
          const control = this.stoneEntryForm.get(field);
          if (control) {
            control.setValidators([Validators.required, Validators.min(0.001)]);
            control.enable({ emitEvent: false });
          }
        });

        this.stoneEntryForm.get('st_quantity')?.disable({ emitEvent: false });
        this.stoneEntryForm.get('st_sub_unit_price')?.disable({ emitEvent: false });
        break;

      default:
        allPotentialInputFields.forEach(field => {
          const control = this.stoneEntryForm.get(field);
          if (control) {
            control.disable({ emitEvent: false });
          }
        });
        break;
    }

    this.stoneEntryForm.updateValueAndValidity();
  }



  filterStoneListByMode(data: any[]): any[] {

    let filtered: any[] = [];

    if (this.selectedViewMode2 === 'all') {
      return data
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .reverse()
        .slice(0, 5);
    }

    if (this.selectedViewMode2 === 'byLine') {
      filtered = data.filter(item =>
        (item.stin_product_type || '').toLowerCase() === 'by line'
      );
    }

    if (this.selectedViewMode2 === 'byStone') {
      filtered = data.filter(item =>
        (item.stin_product_type || '').toLowerCase() === 'by stone'
      );
    }

    if (this.selectedViewMode2 === 'byGram') {
      filtered = data.filter(item =>
        (item.stin_product_type || '').toLowerCase() === 'by gram'
      );
    }


    return filtered
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .reverse()
      .slice(0, 5);
  }


  getStoneList() {
    let params = new HttpParams().set('firm_id', this.currentFirmId);
    this.stockInService.getStockInEntries(params).subscribe({
      next: (res: any) => {
        const allStones = (res.data || []).filter(
          (item: any) => item.stin_product_code_type === 'raw_stone'
        );

        let filtered = this.filterStoneListByMode(allStones);


        filtered = filtered
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);

        this.stoneDataList = filtered;
      },
      error: (err) => {
        console.error('Error fetching stone list:', err);
        this.notificationService.showError('Failed to load stone list.', 'Error');
      }
    });
  }



 patchdata() {
    if (!this.rawMetalProductId) {
      console.warn("rawMetalProductId is not available for patching.");
      return;
    }

    this.rawMetalService.getRawMetalEntryById(this.rawMetalProductId).subscribe({
      next: (response: any) => {
        this.rawStonedata = response.data;

        if (!this.stoneEntryForm || !this.rawStonedata) {
          console.warn("Form not initialized or no data to patch.");
          return;
        }

        this.submitbutton = false;
        this.updatebutton = true;

        this.stoneEntryForm.enable({ emitEvent: false });
        this.selectedDiamond = this.rawStonedata?.st_product_type || '';
        this.selectedSizeType = this.rawStonedata?.st_size_type || 'MM';


        this.updateFormValidators(this.selectedDiamond);

        this.onDiamondSelectionChange(this.selectedDiamond);
        this.onSizeTypeChange(this.selectedSizeType);

        const formControls = Object.keys(this.stoneEntryForm.controls);
        const filteredData: Record<string, any> = {};

        formControls.forEach((key) => {
          if (this.rawStonedata?.hasOwnProperty(key)) {
            let value = this.rawStonedata[key];

            if (key === 'st_item_category' && value && typeof value === 'object') {
              filteredData[key] = value.name;
            }
            // Handle float fields
            else if (['st_unit_price', 'st_sub_unit_price', 'st_subunit', 'st_total_wt', 'st_unit_quantity', 'st_quantity'].includes(key)) {
              filteredData[key] = parseFloat(value ?? 0);
            } else {
              filteredData[key] = value;
            }
          }
        });

        this.stoneEntryForm.patchValue(filteredData, { emitEvent: false });

        // If quantity should be disabled based on type, disable it here
        if (this.selectedDiamond === 'By Line' || this.selectedDiamond === 'By Gram') {
          this.stoneEntryForm.get('st_quantity')?.disable({ emitEvent: false });
          this.stoneEntryForm.get('st_sub_unit_price')?.disable({ emitEvent: false });
        }
      },
      error: (error) => {
        console.error('Error fetching raw metal entry by ID:', error);
        this.notificationService.showError('Failed to load stone data for editing.', 'Error');
      }
    });
  }


  onImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileSize = file.size / 1024 / 1024;

      if (fileSize > 2) {
        this.fileUploadError[index] = 'File size should not exceed 2MB.';
        this.imagePreviews[index] = null;
        this.selectedFiles[index] = null;
        input.value = '';
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.fileUploadError[index] = 'Only JPG, PNG, WEBP images are allowed.';
        this.imagePreviews[index] = null;
        this.selectedFiles[index] = null;
        input.value = '';
        return;
      }

      this.fileUploadError[index] = null;
      this.selectedFiles[index] = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews[index] = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.imagePreviews[index] = null;
      this.selectedFiles[index] = null;
      this.fileUploadError[index] = null;
    }
  }

  setupLiveCalculations(): void {
    if (this.formValueChangeSubscription) {
      this.formValueChangeSubscription.unsubscribe();
    }

    this.formValueChangeSubscription = this.stoneEntryForm.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged((prev, curr) => {
          const currentType = this.selectedDiamond;
          let relevantKeys: string[] = [];

          if (currentType === 'By Line') {
            relevantKeys = ['st_subunit', 'st_unit_quantity', 'st_unit_price'];
          } else if (currentType === 'By Gram') {
            relevantKeys = ['st_total_wt', 'st_subunit', 'st_unit_price'];
          } else if (currentType === 'By Stone') {
            return true;
          }

          for (const key of relevantKeys) {
            if (prev[key] !== curr[key]) {
              return false;
            }
          }
          return true;
        })
      )
      .subscribe(() => {
        this.performCalculations();
      });
  }

  performCalculations(): void {
    const currentType = this.selectedDiamond;

    this.calculatedQuantity = null;
    this.calculatedPerStonePrice = null;

    if (currentType === 'By Line') {
      const stoneInEachLine = parseFloat(this.stoneEntryForm.get('st_subunit')?.value);
      const totalLine = parseFloat(this.stoneEntryForm.get('st_unit_quantity')?.value);
      const perLinePrice = parseFloat(this.stoneEntryForm.get('st_unit_price')?.value);

      if (!isNaN(stoneInEachLine) && stoneInEachLine > 0 && !isNaN(totalLine) && totalLine > 0) {
        this.calculatedQuantity = Math.floor(stoneInEachLine * totalLine);
        this.stoneEntryForm.get('st_quantity')?.setValue(this.calculatedQuantity, { emitEvent: false });
      } else {
        this.stoneEntryForm.get('st_quantity')?.setValue('', { emitEvent: false });
      }

      if (!isNaN(perLinePrice) && perLinePrice > 0 && !isNaN(stoneInEachLine) && stoneInEachLine > 0) {
        this.calculatedPerStonePrice = perLinePrice / stoneInEachLine;
        this.stoneEntryForm.get('st_sub_unit_price')?.setValue(this.calculatedPerStonePrice.toFixed(2), { emitEvent: false });

      } else {
        this.stoneEntryForm.get('st_sub_unit_price')?.setValue('', { emitEvent: false });
      }
    } else if (currentType === 'By Gram') {
      const totalStoneWeight = parseFloat(this.stoneEntryForm.get('st_total_wt')?.value);
      const eachStoneWeight = parseFloat(this.stoneEntryForm.get('st_subunit')?.value);
      const perGramPrice = parseFloat(this.stoneEntryForm.get('st_unit_price')?.value);

      if (!isNaN(totalStoneWeight) && totalStoneWeight > 0 && !isNaN(eachStoneWeight) && eachStoneWeight > 0) {
        this.calculatedQuantity = Math.floor(totalStoneWeight / eachStoneWeight);
        this.stoneEntryForm.get('st_quantity')?.setValue(this.calculatedQuantity, { emitEvent: false });
      } else {
        this.stoneEntryForm.get('st_quantity')?.setValue('', { emitEvent: false });
      }

      if (!isNaN(eachStoneWeight) && eachStoneWeight > 0 && !isNaN(perGramPrice) && perGramPrice > 0) {
        this.calculatedPerStonePrice = eachStoneWeight * perGramPrice;
        this.stoneEntryForm.get('st_sub_unit_price')?.setValue(this.calculatedPerStonePrice.toFixed(2), { emitEvent: false });
      } else {
        this.stoneEntryForm.get('st_sub_unit_price')?.setValue('', { emitEvent: false });
      }
    }

  }


  //default fields for second table
  defaultFields = [
    { key: 'stin_transaction_id', label: 'Transaction ID', selected: true },
    { key: 'stin_panel_name', label: 'Panel Name', selected: true },
    { key: 'stin_entry_from', label: 'Entry From', selected: true },
    { key: 'stin_user_billing_name', label: 'User Billing Name', selected: true },
    { key: 'stin_stock_account_id', label: 'Stock Account ID', selected: true },
    { key: 'stin_staff_id', label: 'Staff ID', selected: true },
    { key: 'stin_staff_sale_month', label: 'Staff Sale Month', selected: true },
    { key: 'stin_transaction_type', label: 'Transaction Type', selected: true },
    { key: 'stin_item_per_id', label: 'Item Per ID', selected: true },
    { key: 'stin_item_id', label: 'Item ID', selected: true },
    { key: 'stin_rfid_no', label: 'RFID No', selected: true },
    { key: 'stin_barcode_prefix', label: 'Barcode Prefix', selected: true },
    { key: 'stin_barcode', label: 'Barcode', selected: true },
    { key: 'stin_payment_mode', label: 'Payment Mode', selected: true },
    { key: 'stin_current_status', label: 'Current Status', selected: true },
    { key: 'stin_sell_status', label: 'Sell Status', selected: true },
    { key: 'stin_direct_sell_status', label: 'Direct Sell Status', selected: true },
    { key: 'stin_bc_print_status', label: 'BC Print Status', selected: true },
    { key: 'stin_jewellars_app_status', label: 'Jewelers App Status', selected: true },
    { key: 'stin_email_status', label: 'Email Status', selected: true },
    { key: 'stin_pre_invoice_no', label: 'Pre Invoice No', selected: true },
    { key: 'stin_invoice_no', label: 'Invoice No', selected: true },
    { key: 'stin_other_charges_by', label: 'Other Charges By', selected: true },
    { key: 'stin_customer_wastage_by', label: 'Customer Wastage By', selected: true },
    { key: 'stin_wastage_by', label: 'Wastage By', selected: true },
    { key: 'stin_value_added_by', label: 'Value Added By', selected: true },
    { key: 'stin_making_charges_by', label: 'Making Charges By', selected: true },
    { key: 'stin_pay_cash_amount', label: 'Pay Cash Amount', selected: true },
    { key: 'stin_pay_online_amount', label: 'Pay Online Amount', selected: true },
    { key: 'stin_pay_cheque_amount', label: 'Pay Cheque Amount', selected: true },
    { key: 'stin_pay_card_amount', label: 'Pay Card Amount', selected: true },
    { key: 'stin_item_code', label: 'Item Code', selected: true },
    { key: 'stin_metal_type', label: 'Metal Type', selected: true },
    { key: 'stin_product_type', label: 'Product Type', selected: true },
    { key: 'stin_stock_type', label: 'Stock Type', selected: true },
    { key: 'stin_item_category', label: 'Item Category', selected: true },
    { key: 'stin_item_name', label: 'Item Name', selected: true },
    { key: 'stin_item_size', label: 'Item Size', selected: true },
    { key: 'stin_color', label: 'Color', selected: true },
    { key: 'stin_purity', label: 'Purity', selected: true },
    { key: 'stin_quantity', label: 'Quantity', selected: true },
    { key: 'stin_metal_rate', label: 'Metal Rate', selected: true },
    { key: 'stin_item_length', label: 'Item Length', selected: true },
    { key: 'stin_item_width', label: 'Item Width', selected: true },
    { key: 'stin_unit_price', label: 'Total Price', selected: true },
    { key: 'stin_unit_quantity', label: 'Unit Quantity', selected: true },
    { key: 'stin_sub_unit_price', label: 'Per Peice Price', selected: true },
    { key: 'stin_total_wt', label: 'Total Weight', selected: true },
    { key: 'stin_gs_weight', label: 'GS Weight', selected: true },
    { key: 'stin_pkt_weight', label: 'PKT Weight', selected: true },
    { key: 'stin_less_weight', label: 'Less Weight', selected: true },
    { key: 'stin_cust_wastage_weight', label: 'Cust Wastage Weight', selected: true },
    { key: 'stin_net_weight', label: 'Net Weight', selected: true },
    { key: 'stin_tag_weight', label: 'Tag Weight', selected: true },
    { key: 'stin_fine_weight', label: 'Fine Weight', selected: true },
    { key: 'stin_final_fine_weight', label: 'Final Fine Weight', selected: true },
    { key: 'stin_making_charges', label: 'Making Charges', selected: true },
    { key: 'stin_lab_charges', label: 'Lab Charges', selected: true },
    { key: 'stin_per_gram_labour', label: 'Per Gram Labour', selected: true },
    { key: 'stin_per_piece_labour', label: 'Per Piece Labour', selected: true },
    { key: 'stin_per_gm_shipping', label: 'Per GM Shipping', selected: true },
    { key: 'stin_per_piece_shipping', label: 'Per Piece Shipping', selected: true },
    { key: 'stin_total_per_piece_price', label: 'Total Per Piece Price', selected: true },
    { key: 'stin_per_piece_silver_price', label: 'Per Piece Silver Price', selected: true },
    { key: 'stin_silver_rate', label: 'Silver Rate', selected: true },
    { key: 'stin_per_piece_weight', label: 'Per Piece Weight', selected: true },
    { key: 'stin_subunit', label: 'Subunit', selected: true },
    { key: 'stin_entry_date', label: 'Entry Date', selected: true },
    { key: 'stin_supplier_name', label: 'Supplier Name', selected: true },
    { key: 'stin_purchase_invoice_no', label: 'Purchase Invoice No', selected: true },
    { key: 'stin_purchase_tax_amount', label: 'Purchase Tax Amount', selected: true },
  ];

  fieldConfigs2: { [key: string]: any[] } = {
    byLine: [
      { key: 'st_item_code', label: 'Product Code', selected: true },
      { key: 'st_item_name', label: 'Name', selected: true },
      { key: 'st_product_type', label: 'Type', selected: true },
      { key: 'st_item_size', label: 'Size', selected: true },
      { key: 'st_color', label: 'Color', selected: true },
      { key: 'st_unit_price', label: 'Per Piece Price', selected: true },
      { key: 'st_quantity', label: 'Quantity', selected: true },
      { key: 'st_sub_unit_price', label: 'Per Stone Price', selected: true },
      { key: 'created_at', label: 'Date', selected: true, isDate: true }
    ],
    byStone: [
      { key: 'st_item_code', label: 'Product Code', selected: true },
      { key: 'st_item_name', label: 'Name', selected: true },
      { key: 'st_item_category', label: 'Category', selected: true, subKey: 'name' },
      { key: 'st_product_type', label: 'Type', selected: true },
      { key: 'st_quantity', label: 'Quantity', selected: true },
      { key: 'st_unit_price', label: 'Stone Price', selected: true },
      { key: 'created_at', label: 'Date', selected: true, isDate: true }
    ],
    byGram: [
      { key: 'st_item_code', label: 'Product Code', selected: true },
      { key: 'st_item_name', label: 'Name', selected: true },
      { key: 'st_total_wt', label: 'Total Weight', selected: true },
      { key: 'st_unit_price', label: 'Gram Price', selected: true },
      { key: 'created_at', label: 'Date', selected: true, isDate: true }
    ]
  };



  updateSecondTableFields(): void {
    localStorage.setItem('stoneViewMode2', this.selectedViewMode2);

    if (this.selectedViewMode2 === 'all') {
      this.selectedFields2 = [
        { key: 'stin_item_code', label: 'Code' },
        { key: 'st_item_category', label: 'Stone Category', subKey: 'name' },
        { key: 'stin_product_type', label: 'Stone Type' },
        { key: 'stin_item_name', label: 'Name' },
        { key: 'stin_item_size', label: 'Size' },
        { key: 'stin_color', label: 'Color' },
        { key: 'stin_unit_price', label: 'Per Line/Gram Price' },
        { key: 'stin_subunit', label: 'Total stone in Each line' },
        { key: 'stin_unit_quantity', label: 'Total Line' },
        { key: 'stin_unit_price', label: 'Total Price' },
        { key: 'stin_total_wt', label: 'Total Stone WT' },
        { key: 'stin_quantity', label: 'Quantity' },
        { key: 'stin_sub_unit_price', label: 'Per Stone Price', selected: true },
        { key: 'stin_entry_date', label: 'Date', isDate: true }
      ];
    } else if (this.selectedViewMode2 === 'byLine') {
      this.selectedFields2 = [
        { key: 'stin_item_code', label: 'Code' },
        { key: 'st_item_category', label: 'Stone Category', subKey: 'name' },
        { key: 'stin_product_type', label: 'Stone Type' },
        { key: 'stin_item_name', label: 'Name' },
        { key: 'stin_item_size', label: 'Size' },
        { key: 'stin_color', label: 'Color' },
        { key: 'stin_unit_price', label: 'Per Line Price' },
        { key: 'stin_subunit', label: 'Total Stone in Each Line' },
        { key: 'stin_unit_quantity', label: 'Total Line' },
        { key: 'stin_quantity', label: 'Quantity' },
        { key: 'stin_sub_unit_price', label: 'Per Stone Price' },
        { key: 'stin_entry_date', label: 'Date', isDate: true }
      ];
    } else if (this.selectedViewMode2 === 'byStone') {
      this.selectedFields2 = [
        { key: 'stin_item_code', label: 'Code' },
        { key: 'st_item_category', label: 'Stone Category', subKey: 'name' },
        { key: 'stin_product_type', label: 'Stone Type' },
        { key: 'stin_item_name', label: 'Name' },
        { key: 'stin_item_size', label: 'Item Size' },
        { key: 'stin_color', label: 'Color' },
        { key: 'stin_quantity', label: 'Quantity' },
        { key: 'stin_sub_unit_price', label: 'Per Stone Price' },
        { key: 'stin_entry_date', label: 'Date', isDate: true }
      ];
    } else if (this.selectedViewMode2 === 'byGram') {
      this.selectedFields2 = [
        { key: 'stin_item_code', label: 'Code' },
        { key: 'st_item_category', label: 'Stone Category', subKey: 'name' },
        { key: 'stin_product_type', label: 'Stone Type' },
        { key: 'stin_item_name', label: 'Name' },
        { key: 'stin_item_size', label: 'Item Size' },
        { key: 'stin_color', label: 'Color' },
        { key: 'stin_subunit', label: 'Each Stone Weight' },
        { key: 'stin_total_wt', label: 'Total Stone Weight' },
        { key: 'stin_unit_price', label: 'Per Gram Price' },
        { key: 'stin_quantity', label: 'Quantity' },
        { key: 'stin_sub_unit_price', label: 'Per Stone Price' },
        { key: 'stin_entry_date', label: 'Date', isDate: true }
      ];
    }

    this.getStoneList();
  }


  onSubmit(): void {
    this.stoneEntryForm.get('st_firm_id')?.setValue(this.currentFirmId);


    this.stoneEntryForm.enable({ emitEvent: false });
    if (this.stoneEntryForm.valid) {
      const formData = new FormData();
      const formValue = this.stoneEntryForm.getRawValue();

      formData.append('st_item_category', formValue.st_item_category);
      formData.append('st_item_code', formValue.st_item_code);
      formData.append('st_item_name', formValue.st_item_name);
      formData.append('st_item_size', formValue.st_item_size);
      formData.append('st_size_type', formValue.st_size_type);
      formData.append('st_color', formValue.st_color);
      formData.append('st_product_type', this.selectedDiamond);
      formData.append('st_metal_type', '-');
      formData.append('st_firm_id', formValue.st_firm_id);
      formData.append('st_purity', '100');
      formData.append('st_product_code_type', 'raw_stone');

      if (this.selectedDiamond === 'By Line') {
        formData.append('st_unit_price', formValue.st_unit_price);
        formData.append('st_quantity', formValue.st_quantity);
        formData.append('st_unit_quantity', formValue.st_unit_quantity);
        formData.append('st_sub_unit_price',formValue.st_sub_unit_price);
        formData.append('st_subunit', formValue.st_subunit);

      } else if (this.selectedDiamond === 'By Stone') {

        formData.append('st_quantity', formValue.st_quantity);
        formData.append('st_sub_unit_price',formValue.st_sub_unit_price);

      } else if (this.selectedDiamond === 'By Gram') {
        formData.append('st_quantity', formValue.st_quantity);
        formData.append('st_sub_unit_price',formValue.st_sub_unit_price);
        formData.append('st_subunit', formValue.st_subunit);
        formData.append('st_total_wt', formValue.st_total_wt);
        formData.append('st_unit_price', formValue.st_unit_price);
      }

      if (this.selectedFiles[0]) {
        formData.append('st_image1', this.selectedFiles[0], this.selectedFiles[0].name);
      }
      if (this.selectedFiles[1]) {
        formData.append('st_image2', this.selectedFiles[1], this.selectedFiles[1].name);
      }

      this.rawMetalService.createRawMetalEntry(formData).subscribe({
        next: (response) => {
          this.notificationService.showSuccess('Stone Entry added successfully!', 'Success');
          this.getStoneList();
          this.getStonePrefix();
          this.getProductCodes();
          this.getCategories();
          this.clearForm();
        },
        error: (error) => {
          console.error('Error adding Stone Entry:', error);
          this.notificationService.showError('Failed to add Stone Entry. Please try again.', 'Error');
        }
      });
    } else {
      this.stoneEntryForm.markAllAsTouched();
      if (this.stoneEntryForm.get('st_firm_id')?.invalid) {
        this.notificationService.showError('Firm selection is required.', 'Validation Error');
      } else {
        this.notificationService.showError('Form is invalid. Please check the fields.', 'Validation Error');
      }
      Object.keys(this.stoneEntryForm.controls).forEach(key => {
        const controlErrors = this.stoneEntryForm.get(key)?.errors;
        if (controlErrors) {
        }
      });
    }
    this.getStoneList();
    this.updateFormValidators(this.selectedDiamond);
  }


  clearForm(): void {
    this.stoneEntryForm.reset({
      st_item_code: this.generatedProductCode,
      st_purity: '100',
      st_metal_type: '-',
      st_product_code_type: 'raw_stone',
      st_firm_id: this.currentFirmId,
    });
    this.selectedDiamond = '';
    this.selectedSizeType = 'MM';
    this.stoneEntryForm.get('st_product_type')?.setValue(this.selectedDiamond, { emitEvent: false });
    this.stoneEntryForm.get('st_size_type')?.setValue(this.selectedSizeType, { emitEvent: false });
    this.updateFormValidators(this.selectedDiamond);

    if (this.imageInput1) {
      this.imageInput1.nativeElement.value = '';
    }
    if (this.imageInput2) {
      this.imageInput2.nativeElement.value = '';
    }

    this.imagePreviews = [null, null];
    this.fileUploadError = [null, null];
    this.selectedFiles = [null, null];

    this.calculatedQuantity = null;
    this.calculatedPerStonePrice = null;

    this.getStonePrefix();
    Object.keys(this.stoneEntryForm.controls).forEach(key => {
      this.stoneEntryForm.controls[key].setErrors(null);
      this.stoneEntryForm.controls[key].markAsPristine();
      this.stoneEntryForm.controls[key].markAsUntouched();
    });
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();

      const target = keyboardEvent.target as HTMLElement;
      const form = target.closest('form');
      if (!form) return;

      const focusable = Array.from(
        form.querySelectorAll<HTMLElement>('input, select, textarea, button')
      ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);

      const index = focusable.indexOf(target);
      if (index > -1 && index + 1 < focusable.length) {
        focusable[index + 1].focus();
      }
    }
  }


  generatedCodeWithPrefix(): string {
    const prefix = this.stonePrefix ?? '';
    const serial = String(this.serialCounter).padStart(5, '0');
    this.serialCounter++;
    return prefix + serial;
  }

  generatedProductCode : string | undefined;
  patchStoneCode(code: string) {
    this.generatedProductCode = code;
    if (this.stoneEntryForm.get('st_item_code')) {
      this.stoneEntryForm.patchValue({ st_item_code: code });
    } else {
      console.warn('st_item_code control not found in form');
    }
  }

  getNextStoneCode(prefix: string) {
    this.customizeService.getNextStoneCode(prefix).subscribe({
    next: (res: any) => {
    if (res?.code) {
    this.patchStoneCode(res.code);
    } else {
    this.clearStoneCode();
    console.warn('No code returned from backend.');
    }
    },
    error: (err) => {
    this.clearStoneCode();
    console.error('Error getting next stone code:', err);
    }
    });
    }


  getStonePrefix() {
    this.customizeService.getCustomizeSettings().subscribe((response: any) => {
    if (response?.data && response.data.length > 0) {
    this.prefixData = response.data[response.data.length - 1];
    this.stonePrefix = this.prefixData?.customize_stone_prefix;

    if (this.stonePrefix) {
    this.getNextStoneCode(this.stonePrefix);
    } else {
    this.clearStoneCode();
    console.warn('Stone prefix is missing in the latest data.');
    }

    } else {
    this.prefixData = null;
    this.stonePrefix = null;
    this.clearStoneCode();
    }
    }, error => {
    this.prefixData = null;
    this.stonePrefix = null;
    this.clearStoneCode();
    console.error('Error fetching prefix data:', error);
    });
    }


  clearStoneCode() {
    if (this.stoneEntryForm.get('st_item_code')) {
      this.stoneEntryForm.patchValue({ st_item_code: '' });
    }
  }

  editStone() {
    if (!this.stoneEntryForm.valid) {
      this.notificationService.showError('Please fill out all required fields correctly.', 'Validation Error');
      return;
    }

    let updatedData = this.stoneEntryForm.getRawValue();


    updatedData.st_item_category_id = updatedData.st_item_category?.id;
    delete updatedData.st_item_category;

    this.rawMetalService.updateRawStoneEntry(this.rawMetalProductId, updatedData).subscribe({
      next: (response) => {
        this.notificationService.showSuccess('Stone entry updated successfully.', 'Success');
      },
      error: (error) => {
        console.error('Error updating stone entry:', error);
        this.notificationService.showError('Failed to update stone entry.', 'Error');
      }
    });


  }

  productCodeRelatedData: any;

  onProductCodeChange(event: Event) {
    const code = (event.target as HTMLInputElement).value;


    if (!code) {

      this.stoneEntryForm.reset({
        st_purity: '100',
        st_product_code_type: 'raw_stone',
        st_firm_id: this.currentFirmId,
        st_item_code: ''
      }, { emitEvent: false });
      this.selectedDiamond = '';
      this.selectedSizeType = '';
      this.updateFormValidators(this.selectedDiamond);
      this.getStonePrefix();
      return;
    }

    this.rawMetalService.get_Stone_Data_By_Product_Code_And_Product_Code_Type(code)
      .subscribe({
        next: (response: any) => {
          if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
            const data = response.data[0];

            this.stoneEntryForm.enable({ emitEvent: false });

            this.stoneEntryForm.patchValue({
              st_item_name: data.st_item_name || '',
              st_item_size: data.st_item_size || '',
              st_size_type: data.st_size_type || '',
              st_item_category: data.st_item_category || null,
              st_purity: '100',
              st_product_type: data.st_product_type || '',
              st_color: data.st_color || '',
              st_unit_price: parseFloat(data.st_unit_price || 0),
              st_subunit: parseFloat(data.st_subunit || 0),
              st_unit_quantity: parseFloat(data.st_unit_quantity || 0),
              st_total_wt: parseFloat(data.st_total_wt || 0),
              st_quantity: parseFloat(data.st_quantity || 0),
              st_sub_unit_price: parseFloat(data.st_sub_unit_price || 0),
            }, { emitEvent: false });

            this.selectedDiamond = data.st_product_type || '';
            this.onDiamondSelectionChange(this.selectedDiamond);

            this.selectedSizeType = data.st_size_type || '';
            this.onSizeTypeChange(this.selectedSizeType);

          } else {
            const currentCode = this.stoneEntryForm.get('st_item_code')?.value;
            this.stoneEntryForm.reset({
              st_purity: '100',
              st_product_code_type: 'raw_stone',
              st_firm_id: this.currentFirmId,
              st_item_code: currentCode
            }, { emitEvent: false });
            this.selectedDiamond = '';
            this.selectedSizeType = '';
            this.updateFormValidators(this.selectedDiamond);
          }
        },
        error: (error) => {
          console.error("API error fetching product code data:", error);
          this.notificationService.showError('Error fetching product data.', 'Error');
          const currentCode = this.stoneEntryForm.get('st_item_code')?.value;
          this.stoneEntryForm.reset({
            st_purity: '100',
            st_product_code_type: 'raw_stone',
            st_firm_id: this.currentFirmId,
            st_item_code: currentCode
          }, { emitEvent: false });
          this.selectedDiamond = '';
          this.selectedSizeType = '';
          this.updateFormValidators(this.selectedDiamond);
        }
      });
  }




  //Below code for categories
  stoneCategoryList: string[] = [];
  filteredStoneCategories: string[] = [];
  showCategoryDropdown = false;
  activeCategoryIndex = -1;

  getCategories() {
    const params = new HttpParams();
    this.stockGeneralService.getCategories(params).subscribe((res: any) => {
      this.stoneCategoryList = res.data.map((category: any) => category.name);
      this.filteredStoneCategories = [...this.stoneCategoryList];
    });
  }

  onFocusCategory() {
    this.filteredStoneCategories = [...this.stoneCategoryList];
    this.showCategoryDropdown = true;
  }

  onBlurCategory() {
    setTimeout(() => {
      this.showCategoryDropdown = false;
    }, 200);
  }

  onInputCategory(event: any) {
    const value = event.target.value?.toLowerCase() || '';
    this.filteredStoneCategories = this.stoneCategoryList.filter(category =>
      category.toLowerCase().includes(value)
    );
  }

  onSelectCategory(category: string) {
    this.stoneEntryForm.get('st_item_category')?.setValue(category);
    this.showCategoryDropdown = false;
    this.activeCategoryIndex = -1;
  }

  onCategoryKeyDown(event: KeyboardEvent) {
    if (!this.showCategoryDropdown || this.filteredStoneCategories.length === 0) return;


    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeCategoryIndex = (this.activeCategoryIndex + 1) % this.filteredStoneCategories.length;
      this.scrollToActiveCategory();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeCategoryIndex = (this.activeCategoryIndex - 1 + this.filteredStoneCategories.length) % this.filteredStoneCategories.length;
      this.scrollToActiveCategory();
    } else if (event.key === 'Enter' && this.activeCategoryIndex > -1) {
      event.preventDefault();
      const selectedCategory = this.filteredStoneCategories[this.activeCategoryIndex];
      this.onSelectCategory(selectedCategory);
    }
  }


  scrollToActiveCategory() {
    setTimeout(() => {
      const listItems = document.querySelectorAll('.category-list-item');
      const activeItem = listItems[this.activeCategoryIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    });
  }
   rawMetalProductCodes:any;
   rawStoneProductCodes:any;
   generalProductCodes:any;
   private allGeneralProducts: any[] = [];

   allProductCodes: { code: string; name: string }[] = [];
   filteredProductCodes: { code: string; name: string }[] = [];
   showDropdown = false;
   activeCodeIndex = -1;

   getProductCodes() {
    let params = new HttpParams().set('firm_id', this.currentFirmId).set('st_code_type','raw_stone');
    this.rawMetalService.getStockData(params).subscribe({
      next: (rawMetal: any) => {
        this.allProductCodes = rawMetal?.data?.map((item: any) => ({
          code: item.st_item_code,
          name: item.st_item_name
        })) || [];
        this.filteredProductCodes = [...this.allProductCodes];
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load raw metal product codes.', 'Error');
      }
    });
  }


   onFocusProductCodeForNewInput() {
     this.filteredProductCodes = [...this.allProductCodes];
     this.showDropdown = true;
   }

   onBlurProductCodeForNewInput() {
     setTimeout(() => {
       this.showDropdown = false;
     }, 200);
   }

   onInputProductCodeForNewInput(event: any) {
     const value = (event.target as HTMLInputElement).value || '';
     if (value === '') {
       this.stoneEntryForm.patchValue({
         st_item_name: '',
         st_item_size: '',
         st_quantity: '',
         st_product_type: '',
         st_purity: '100',
         st_product_code_type: '',
         st_size_type: '',
         st_unit_price: '',
         st_sub_unit_price: '',
       }, { emitEvent: false });
       this.selectedDiamond = '';
       this.selectedSizeType = '';
       this.updateFormValidators(this.selectedDiamond);
     } else {
      this.filteredProductCodes = this.allProductCodes.filter((item: { code: string; name: string; }) =>
        item.code.toLowerCase().includes(value.toLowerCase()) ||
        item.name.toLowerCase().includes(value.toLowerCase())
      );
     }
   }

   onSelectProductCodeForNewInput(item: { code: string; name: string }) {
     const code = item.code;
     this.stoneEntryForm.get('st_item_code')?.setValue(code);
     this.showDropdown = false;
     this.activeCodeIndex = -1;
     this.rawMetalService.get_Stone_Data_By_Product_Code_And_Product_Code_Type(code)
       .subscribe({
         next: (response: any) => {
           if (response?.data && Array.isArray(response.data) && response.data.length > 0) {
             const data = response.data[0];

             this.stoneEntryForm.patchValue({
              st_product_type: data.st_product_type || '',
              st_item_name: data.st_item_name || '',
              st_item_size: data.st_item_size || '',
              st_item_category: data.st_item_category?.name || '',
              st_purity: '100',
              st_product_code_type: 'raw_stone',
              st_color: data.st_color || '',
              st_size_type: data.st_size_type || '',
              st_unit_price: '',
              st_quantity: data.st_quantity || '',
              st_unit_quantity: data.st_sub_unit_quantity || '',
             }, { emitEvent: false });

             this.selectedDiamond = data.st_product_type || '';
             this.onDiamondSelectionChange(this.selectedDiamond);

             this.selectedSizeType = data.st_size_type || '';
             this.onSizeTypeChange(this.selectedSizeType);

           } else {
             this.patchProductCodeRelatedDataWithGeneralDetailsForNewInput(code);
           }
         },
         error: (err: any) => {
           console.error("API error fetching raw metal data:", err);
           this.patchProductCodeRelatedDataWithGeneralDetailsForNewInput(code);
         }
       });
   }

   patchProductCodeRelatedDataWithGeneralDetailsForNewInput(code: string) {
     const productData = this.allGeneralProducts.find((item: any) => item.unique_code_sku === code);

     if (productData) {
       this.stoneEntryForm.patchValue({
         st_item_name: productData.product_name || '',
         st_product_type: '',
         st_item_size: productData.product_size || '',
         st_quantity: productData.quantity || '',
         st_purity: '100',
         st_product_code_type: productData.product_type || 'general',
         st_size_type: '',
         st_unit_price: productData.unit_price || '',
         st_sub_unit_price: productData.sub_unit_price || '',
       });
       this.selectedDiamond = '';
       this.selectedSizeType = '';
       this.updateFormValidators(this.selectedDiamond);
     } else {
       console.warn(`Product code '${code}' not found in any product list for new input.`);
       const currentCode = this.stoneEntryForm.get('st_item_code')?.value;
       this.stoneEntryForm.reset({
         st_purity: '100',
         st_product_code_type: 'raw_stone',
         st_firm_id: this.currentFirmId,
         st_item_code: currentCode
       }, { emitEvent: false });
       this.selectedDiamond = '';
       this.selectedSizeType = '';
       this.updateFormValidators(this.selectedDiamond);
     }
   }

   onCodeKeyDownForNewInput(event: KeyboardEvent) {
     if (!this.showDropdown || this.filteredProductCodes.length === 0) return;

     if (event.key === 'ArrowDown') {
       event.preventDefault();
       this.activeCodeIndex =
         (this.activeCodeIndex + 1) % this.filteredProductCodes.length;
       this.scrollToActiveItemForNewInput();
     } else if (event.key === 'ArrowUp') {
       event.preventDefault();
       this.activeCodeIndex =
         (this.activeCodeIndex - 1 + this.filteredProductCodes.length) %
         this.filteredProductCodes.length;
       this.scrollToActiveItemForNewInput();
     } else if (event.key === 'Enter' && this.activeCodeIndex > -1) {
       event.preventDefault();
       const selectedCode = this.filteredProductCodes[this.activeCodeIndex];
       this.onSelectProductCodeForNewInput(selectedCode);
     }
   }

   scrollToActiveItemForNewInput() {
     setTimeout(() => {
       const listItems = document.querySelectorAll('.new-code-list-item');
       const activeItem = listItems[this.activeCodeIndex] as HTMLElement;
       if (activeItem) {
         activeItem.scrollIntoView({ block: 'nearest' });
       }
     });
   }
}
