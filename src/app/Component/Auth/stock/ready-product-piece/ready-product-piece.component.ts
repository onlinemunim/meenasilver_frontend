import { StockGeneralService } from './../../../../Services/Product_Creation/stock-general.service';
import { Component, inject, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { NgIf, DatePipe, NgClass, NgFor } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'; // Import Validators
import { FormBuilder } from '@angular/forms';
import { ReadyProductService } from '../../../../Services/Ready-Product/ready-product.service';
import { NotificationService } from '../../../../Services/notification.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FirmService } from '../../../../Services/firm.service';
import { ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Datepicker } from 'flowbite-datepicker';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { RawStoneService } from '../../../../Services/Raw_Stone/raw-stone.service';
import { forkJoin, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service';
import { StockPriceService } from '../../../../Services/Product_Creation/stock-price.service';
import { HttpParams } from '@angular/common/http';
import { UserSupplierService } from '../../../../Services/User/Supplier/user-supplier.service';
import { CategoryService } from '../../../../Services/Category/category.service';

@Component({
  selector: 'app-ready-product-piece',
  imports: [CustomSelectComponent, NgIf, ReactiveFormsModule, NgClass, NgFor,RouterModule],
  templateUrl: './ready-product-piece.component.html',
  styleUrl: './ready-product-piece.component.css',
  providers: [DatePipe]
})
export class ReadyProductPieceComponent implements OnInit, AfterViewInit, OnDestroy {
  readyProductForm!: FormGroup;
  readyProductData: any;
  selectedImageFile: File | null = null;
  fileUploadError!: string;
  readyProductId: any;
  updateButton:boolean = false;
  submitButton:boolean = true;

  activateroute = inject(ActivatedRoute);
  firmList: any;
  form: any;
  supplierList: { id: number; name: string }[] = [];
  @ViewChildren('supplierItem') supplierItems!: QueryList<ElementRef>;

  private calculationsSubscription: Subscription = new Subscription();
  currentFirmId: any;
  firmSelectionSubscription: any;
  private isManuallySelectingCode = false;


  // Regex pattern for numbers with up to two decimal places.
  // It allows integers, or decimals with one or two digits after the point.
  // Examples: 100, 100.3, 100.32, .50
  private readonly decimalTwoPlacesPattern = /^\d*(\.\d{0,2})?$/;
  readyProductDataList: any[] = [];

  constructor(
    private fb:FormBuilder,
    private readyProductService:ReadyProductService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    private firmService:FirmService,
    private rawMetalService:RawMetalService,
    private stockGeneralService:StockGeneralService,
    private firmSelectionService: FirmSelectionService,
    private customizeService:CustomizeService,
    private stockPriceService: StockPriceService,
    private userSupplierService:UserSupplierService,
    private categoryService:CategoryService
  ){}

  ngOnInit(): void {
    this.initReadyProduct();
    this.loadFirmList();
    this.getProductCodes();
    this.setupAutomaticProductCodeGeneration();
    this.getPackagingStackDetails();
    this.getReadyProductList();
    this.getSupplierList();

    this.getCategories();

    this.readyProductId = this.activateroute.snapshot.params['id'];
    if (this.readyProductId) {
      this.patchData().then(() => {
        this.listenToSizeAdjustChanges();
        this.setupCaratPriceCalculation();
        this.setupPerGmCostCalculation();
      });
    } else {
      this.listenToSizeAdjustChanges();
      this.setupCaratPriceCalculation();
      this.setupPerGmCostCalculation();
    }
  }

  ngAfterViewInit(): void {
    const datepickerEl = document.getElementById('date');
    if (datepickerEl) {
      const initialDateValue = this.readyProductForm.get('rproduct_date')?.value;
      (datepickerEl as HTMLInputElement).value = initialDateValue;

      const datepicker = new Datepicker(datepickerEl, {
        format: 'yyyy-mm-dd',
        autohide: true,
      });

      datepickerEl.addEventListener('changeDate', (event: any) => {
        const selectedDate = event.detail.date;
        const formattedSelectedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
        this.readyProductForm.get('rproduct_date')?.setValue(formattedSelectedDate, { emitEvent: false });
      });
    }
  }

  ngOnDestroy(): void {
    if (this.calculationsSubscription) {
      this.calculationsSubscription.unsubscribe();
    }
    if (this.firmSelectionSubscription) {
      this.firmSelectionSubscription.unsubscribe();
    }
  }

  setupAutomaticProductCodeGeneration(): void {
    const categoriesControl = this.readyProductForm.get('rproduct_categories');
    const subcategoriesControl = this.readyProductForm.get('rproduct_subcategories');

    if (categoriesControl && subcategoriesControl) {
        this.calculationsSubscription.add(
            categoriesControl.valueChanges.subscribe(() => this.triggerCodeGeneration())
        );
        this.calculationsSubscription.add(
            subcategoriesControl.valueChanges.subscribe(() => this.triggerCodeGeneration())
        );
    }
  }

  triggerCodeGeneration(): void {
      if (this.updateButton || this.isManuallySelectingCode) {
          return;
      }

      const category = this.readyProductForm.get('rproduct_categories')?.value;
      const subCategory = this.readyProductForm.get('rproduct_subcategories')?.value;

      if (category && subCategory && typeof category === 'string' && typeof subCategory === 'string') {
          const prefix = 'M' +
                         (category.charAt(0) || '').toUpperCase() +
                         (subCategory.replace(/\s/g, '').charAt(0) || '').toUpperCase();

          if (prefix.length === 3) {
              this.readyProductService.getNextCodeByPrefix(prefix).subscribe({
                  next: (res: any) => {
                      if (res?.code) {
                          this.patchMetalCode(res.code);
                      } else {
                          this.clearMetalCode();
                      }
                  },
                  error: (err) => {
                      this.clearMetalCode();
                      console.error('Error fetching product code for prefix:', prefix, err);
                      this.notificationService.showError('Could not generate product code.', 'Error');
                  }
              });
          }
      } else {
          this.clearMetalCode();
      }
  }
  listenToSizeAdjustChanges() {
    this.readyProductForm.get('rproduct_sizeadjust')?.valueChanges.subscribe(value => {
      this.selectedSizeAdjust = value;
    });

    this.selectedSizeAdjust = this.readyProductForm.get('rproduct_sizeadjust')?.value;
  }

  initReadyProduct(){
    this.firmSelectionSubscription = this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      this.currentFirmId = firm?.id;
      // If the form is already initialized, update the firm_id
      if (this.readyProductForm) {
        this.readyProductForm.get('rproduct_firm_id')?.setValue(this.currentFirmId);
      }
    });

    const now = new Date();
    const formattedDate = this.datePipe.transform(now, 'yyyy-MM-dd');

    this.readyProductForm = this.fb.group({
      rproduct_date: [formattedDate],
      rproduct_firm_id: [this.currentFirmId], // Use currentFirmId directly here
      rproduct_supplier_name: [''],
      rproduct_supplier_code: [''],
      rproduct_supplier_product_code: [''],
      rproduct_unit: ['GM(Gram)'],
      rproduct_categories: [''],
      rproduct_subcategories: [''],
      rproduct_name: [''],
      rproduct_code: [''],
      rproduct_silver_rate_per_gm: ['', [Validators.pattern(this.decimalTwoPlacesPattern), Validators.min(0)]],
      rproduct_per_gram_labour: ['', [Validators.pattern(this.decimalTwoPlacesPattern), Validators.min(0)]],
      rproduct_shipping_per_gm: ['', [Validators.pattern(this.decimalTwoPlacesPattern), Validators.min(0)]],
      rproduct_other_expense_per_gm: ['', [Validators.pattern(this.decimalTwoPlacesPattern), Validators.min(0)]],
      rproduct_packaging_cost: [''],
      rproduct_per_gm_cost_without_packaging: [{ value: '', disabled: true }],
      rproduct_packaging_stock: [''],
      rproduct_quantity: [''],
      rproduct_total_wt: [''],
      rproduct_image: [''],
      rproduct_image_display: [''],
      rproduct_stonetype: [''],
      rproduct_stone_color: [''],
      rproduct_polishtype: [''],
      rproduct_sizeadjust: ['yes'],
      rproduct_carat: ['', [Validators.pattern(this.decimalTwoPlacesPattern), Validators.min(0)]],
      rproduct_per_carat_price: ['', [Validators.pattern(this.decimalTwoPlacesPattern), Validators.min(0)]],
      rproduct_total_carat_price: [{ value: '', disabled: true }],
      rproduct_stone_price: [''],
      rproduct_size: [''],
      st_product_code_type: ['ready-product'],
      rproduct_type:['piece-wise']
    });
  }

  onSubmit(){
    this.createReadyProduct();
    this.getProductCodes();
  }

  clearForm(){
    this.readyProductForm.reset({
      rproduct_code: this.generatedReadyProductCode,
      rproduct_unit: 'GM(Gram)',
      rproduct_sizeadjust: 'yes',
      rproduct_firm_id: this.currentFirmId,
      st_product_code_type: 'ready-product',
      rproduct_type:'piece-wise'
    });

    const now = new Date();
    const formattedDate = this.datePipe.transform(now, 'yyyy-MM-dd');
    this.readyProductForm.get('rproduct_date')?.setValue(formattedDate);

    const datepickerEl = document.getElementById('date') as HTMLInputElement;
    if (datepickerEl) {
      datepickerEl.value = formattedDate ?? '';
    }

    this.selectedImageFile = null;
    this.fileUploadError = '';
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        this.fileUploadError = 'Only JPEG, PNG, and WEBP files are allowed.';
        input.value = '';
        this.selectedImageFile = null;
        this.readyProductForm.patchValue({ rproduct_image_display: '' });
        return;
      } else {
        this.fileUploadError = '';
      }

      const fileSize = file.size / 1024 / 1024;
      if (fileSize > 2) {
        this.fileUploadError = 'File size should not exceed 2MB.';
        input.value = '';
        this.selectedImageFile = null;
        this.readyProductForm.patchValue({ rproduct_image_display: '' });
        return;
      }

      this.selectedImageFile = file;

      this.readyProductForm.patchValue({
        rproduct_image_display: file.name,
      });
    } else {
      this.selectedImageFile = null;
      this.readyProductForm.patchValue({ rproduct_image_display: '' });
      this.fileUploadError = '';
    }
  }

  createReadyProduct() {
    // this.readyProductForm.markAllAsTouched();
    // if (this.readyProductForm.invalid) {
    //   this.notificationService.showError('Form is invalid. Please check the highlighted fields.', 'Validation Error');
    //   return;
    // }

    const formValue = { ...this.readyProductForm.getRawValue() };

    if (formValue.rproduct_date) {
      const date = new Date(formValue.rproduct_date);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      formValue.rproduct_date = `${yyyy}-${mm}-${dd}`;
    }

    const formData = new FormData();

    const nullableNumericFields = [
      'rproduct_per_gm_cost_without_packaging',
      'rproduct_per_carat_price',
      'rproduct_total_carat_price',
      'rproduct_total_wt',
      'rproduct_silver_rate_per_gm',
      'rproduct_per_gram_labour',
      'rproduct_shipping_per_gm',
      'rproduct_other_expense_per_gm',
      'rproduct_packaging_cost',
      'rproduct_quantity',
      'rproduct_carat',
      'rproduct_stone_price'
    ];

    Object.keys(formValue).forEach((key) => {
      const value = formValue[key];
      if (nullableNumericFields.includes(key) && (value === '' || value === null)) {
        formData.append(key, '');
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    if (this.selectedImageFile) {
      formData.append('rproduct_image', this.selectedImageFile);
    }

    this.readyProductService.createReadyProduct(formData).subscribe(
      (response: any) => {
        this.readyProductData = response.data;
        this.notificationService.showSuccess('Ready Product Created Successfully!', 'Success');
        this.clearForm();
        this.getReadyProductList();
      },
      (error: any) => {
        console.error('Error creating Ready Product:', error);
        let errorMessage = 'Failed to create Ready Product. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.notificationService.showError(errorMessage, 'Error');
      }
    );
  }

  patchData(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.readyProductService.getReadyProduct(this.readyProductId).subscribe(
        (response: any) => {
          const data = response.data;

          if (data.rproduct_date) {
            data.rproduct_date = this.datePipe.transform(data.rproduct_date, 'yyyy-MM-dd');
          }

          const { rproduct_per_gm_cost_without_packaging, ...dataToPatch } = data;
          this.readyProductForm.patchValue(dataToPatch);

          this.readyProductForm.patchValue({
            rproduct_image_display: this.extractFileName(data.rproduct_image),
          });

          const datepickerEl = document.getElementById('date') as HTMLInputElement;
          if (datepickerEl && data.rproduct_date) {
            datepickerEl.value = data.rproduct_date;
          }

          this.updateButton = true;
          this.submitButton = false;
          resolve();
        },
        (error: any) => {
          console.error('Error patching data:', error);
          this.notificationService.showError('Failed to load product data for editing.', 'Error');
          reject(error);
        }
      );
    });
  }

  extractFileName(url: string): string {
    return url ? url.split('/').pop() || '' : '';
  }

  UpdateReadyProduct(): void {
    this.readyProductForm.markAllAsTouched();
    if (this.readyProductForm.invalid) {
      this.notificationService.showError('Form is invalid. Please check the highlighted fields.', 'Validation Error');
      return;
    }

    const formValue = { ...this.readyProductForm.getRawValue() };

    if (formValue.rproduct_date) {
      const date = new Date(formValue.rproduct_date);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      formValue.rproduct_date = `${yyyy}-${mm}-${dd}`;
    }

    this.readyProductService.updateReadyProduct(this.readyProductId, formValue).subscribe(
      (response: any) => {
        this.notificationService.showSuccess('Ready product updated successfully!', 'Success');
      },
      (error: any) => {
        console.error('Error updating Ready Product:', error);
        let errorMessage = 'Failed to update ready product. Please try again.';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        this.notificationService.showError(errorMessage, 'Error');
      }
    );
  }

  firmTypes: { id: number; name: string }[] = [];
  selectedFirmType: string = '';

  saleUnit: string[] = [
    'GM(Gram)',
  ];
  selectedSaleUnit: string = '';

  getCategories() {
    this.categoryService.getCategories().subscribe((res: any) => {
      this.prodCategory = res.data
        .filter((item: any) => item.mrp && item.mrp !== '')
        .map((item: any) => item.name);
    });
  }

  prodCategory: string [] = [];
  selectedProdCategory: string = '';

  subCategory: string[] = [
    'Gilver LRing',
    'Child Ring'
  ];
  selectedSubCategory: string = '';

  stoneTypes: string[] = [
    '5A CZ Stone',
    'Mossenite',
    'Other',
  ];
  selectedStoneType: string = '';

  stoneColors: string[] = [
    'Pink',
  ];
  selectedStoneColor: string = '';

  polishType: string[] = [
    'Electrplated',
    'High Polish',
    'Oxidized',
  ];
  selectedPolish: string = '';

  sizeAdjust: string[] = [
    'yes',
    'no',
  ];
  selectedSizeAdjust: string = '';

  loadFirmList() {
    this.firmService.getFirms().subscribe((res: any) => {
      this.firmTypes = res.data;
    });
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
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

  setupCaratPriceCalculation() {
    const caratControl = this.readyProductForm.get('rproduct_carat');
    const perCaratPriceControl = this.readyProductForm.get('rproduct_per_carat_price');
    const totalCaratPriceControl = this.readyProductForm.get('rproduct_total_carat_price');

    if (caratControl && perCaratPriceControl && totalCaratPriceControl) {
      const recalculateCarat = () => {
        const carat = parseFloat(caratControl.value) || 0;
        const perCarat = parseFloat(perCaratPriceControl.value) || 0;
        const total = carat * perCarat;
        totalCaratPriceControl.patchValue(total.toFixed(2), { emitEvent: false }); // Formatted to 2 decimal places
      };

      this.calculationsSubscription.add(
        caratControl.valueChanges
          .pipe(debounceTime(100), distinctUntilChanged())
          .subscribe(() => recalculateCarat())
      );
      this.calculationsSubscription.add(
        perCaratPriceControl.valueChanges
          .pipe(debounceTime(100), distinctUntilChanged())
          .subscribe(() => recalculateCarat())
      );
      // Perform initial calculation if values are pre-filled
      recalculateCarat();
    }
  }

  setupPerGmCostCalculation(): void {
    const silverRateControl = this.readyProductForm.get('rproduct_silver_rate_per_gm');
    const perGramLabourControl = this.readyProductForm.get('rproduct_per_gram_labour');
    const shippingPerGmControl = this.readyProductForm.get('rproduct_shipping_per_gm');
    const otherExpensePerGmControl = this.readyProductForm.get('rproduct_other_expense_per_gm');
    const perGmCostWithoutPackagingControl = this.readyProductForm.get('rproduct_per_gm_cost_without_packaging');

    if (
      silverRateControl &&
      perGramLabourControl &&
      shippingPerGmControl &&
      otherExpensePerGmControl &&
      perGmCostWithoutPackagingControl
    ) {
      const recalculatePerGmCost = () => {
        const silverRate = parseFloat(silverRateControl.value) || 0;
        const perGramLabour = parseFloat(perGramLabourControl.value) || 0;
        const shippingPerGm = parseFloat(shippingPerGmControl.value) || 0;
        const otherExpensePerGm = parseFloat(otherExpensePerGmControl.value) || 0;

        const totalCost = silverRate + perGramLabour + shippingPerGm + otherExpensePerGm;

        perGmCostWithoutPackagingControl.patchValue(totalCost.toFixed(2), { emitEvent: false }); // Formatted to 2 decimal places
      };

      this.calculationsSubscription.add(
        silverRateControl.valueChanges
          .pipe(debounceTime(100), distinctUntilChanged())
          .subscribe(() => recalculatePerGmCost())
      );
      this.calculationsSubscription.add(
        perGramLabourControl.valueChanges
          .pipe(debounceTime(100), distinctUntilChanged())
          .subscribe(() => recalculatePerGmCost())
      );
      this.calculationsSubscription.add(
        shippingPerGmControl.valueChanges
          .pipe(debounceTime(100), distinctUntilChanged())
          .subscribe(() => recalculatePerGmCost())
      );
      this.calculationsSubscription.add(
        otherExpensePerGmControl.valueChanges
          .pipe(debounceTime(100), distinctUntilChanged())
          .subscribe(() => recalculatePerGmCost())
      );

      // Perform initial calculation if values are pre-filled
      recalculatePerGmCost();
    }
  }

  rawMetalProductCodes:any;
  rawStoneProductCodes:any;
  generalProductCodes:any;
  private allGeneralProducts: any[] = [];

  allProductCodes: string[] = [];
  filteredProductCodes: string[] = [];
  showDropdown = false;

  getProductCodes() {
    this.rawMetalService.getReadyProductByType('piece-wise').subscribe((response: any) => {
      this.allProductCodes = response.data.map((item: any) => item.rproduct_code) || [];
      this.filteredProductCodes = [...this.allProductCodes];

    }, (error: any) => {
      console.error('Error fetching product codes:', error);
      this.notificationService.showError('Failed to load product codes.', 'Error');
    });
  }

  onFocusProductCode() {
    this.filteredProductCodes = [...this.allProductCodes];
    this.showDropdown = true;
  }

  onBlurProductCode() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  onInputProductCode(event: any) {
    const value = (event.target as HTMLInputElement).value || '';
    if(value === '') {
      this.readyProductForm.patchValue({
        rproduct_name: '',
        rproduct_categories: '',
        rproduct_subcategories: '',
        rproduct_stonetype: '',
        rproduct_stone_color: '',
        rproduct_size: '',
        rproduct_carat: '',
        rproduct_per_carat_price: '',
        rproduct_total_carat_price: '',
        rproduct_stone_price: '',
        rproduct_silver_rate_per_gm: '',
        rproduct_per_gram_labour: '',
        rproduct_shipping_per_gm: '',
        rproduct_other_expense_per_gm: '',
        rproduct_total_wt: '',
        rproduct_quantity: '',
        rproduct_unit: 'GM(Gram)',
      }, { emitEvent: false });
    } else {
      this.filteredProductCodes = this.allProductCodes.filter(code =>
        code.toLowerCase().includes(value.toLowerCase())
      );
    }
  }

  onSelectProductCode(code: string) {

  this.readyProductForm.get('rproduct_code')?.setValue(code);
  this.showDropdown = false;
  this.activeCodeIndex = -1;

  this.rawMetalService.searchByStCode(code).subscribe({
  next: (response: any) => {
    const dataArray = response.data || [];

    if (dataArray.length >= 1) {
      const rawMetalData = dataArray[0];

      if (rawMetalData) {
        // 1. Exclude unwanted fields
        const { rproduct_quantity, rproduct_total_wt, ...filteredData } = rawMetalData;

        const normalizedData = {
          ...filteredData,
          rproduct_categories: rawMetalData.rproduct_categories?.name || ''
        };
          this.readyProductForm.patchValue(normalizedData, { emitEvent: false });
      }
    } else {
      this.patchProductCodeRelatedDataWithGeneralDetails(code);
      setTimeout(() => this.isManuallySelectingCode = false, 100);
    }
  },
  error: (err: any) => {
    console.error('Error fetching raw metal data:', err);
    this.patchProductCodeRelatedDataWithGeneralDetails(code);
    setTimeout(() => this.isManuallySelectingCode = false, 100);
  }
  });
}


  patchProductCodeRelatedDataWithGeneralDetails(code: string) {
    const productData = this.allGeneralProducts.find((item: any) => item.unique_code_sku === code);

    if (productData) {
      this.readyProductForm.patchValue({
        rproduct_name: productData.product_name,
        rproduct_categories: productData.product_category,
        rproduct_subcategories: productData.product_sub_category,
        rproduct_stonetype: productData.stone_type,
        rproduct_stone_color: productData.stone_color,
        rproduct_size: productData.product_size,
        rproduct_carat: productData.total_carat,
        rproduct_per_carat_price: productData.per_carat_price,
        rproduct_total_carat_price: productData.total_carat_price,
        rproduct_stone_price: productData.stone_price,
        rproduct_unit: productData.unit,
        rproduct_silver_rate_per_gm: '',
        rproduct_per_gram_labour: '',
        rproduct_shipping_per_gm: '',
        rproduct_other_expense_per_gm: '',
        rproduct_total_wt: '',
        rproduct_quantity: '',
      });
    } else {
      console.warn(`Product code '${code}' not found in any product list.`);
      this.readyProductForm.patchValue({
        rproduct_name: '',
        rproduct_categories: '',
        rproduct_subcategories: '',
        rproduct_stonetype: '',
        rproduct_stone_color: '',
        rproduct_size: '',
        rproduct_carat: '',
        rproduct_per_carat_price: '',
        rproduct_total_carat_price: '',
        rproduct_stone_price: '',
        rproduct_unit: 'GM(Gram)',
        rproduct_silver_rate_per_gm: '',
        rproduct_per_gram_labour: '',
        rproduct_shipping_per_gm: '',
        rproduct_other_expense_per_gm: '',
        rproduct_total_wt: '',
        rproduct_quantity: '',
      }, { emitEvent: false });
    }
  }

  activeCodeIndex = -1;

  onCodeKeyDown(event: KeyboardEvent) {
    if (!this.showDropdown || this.filteredProductCodes.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeCodeIndex =
        (this.activeCodeIndex + 1) % this.filteredProductCodes.length;
      this.scrollToActiveItem();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeCodeIndex =
        (this.activeCodeIndex - 1 + this.filteredProductCodes.length) %
        this.filteredProductCodes.length;
      this.scrollToActiveItem();
    } else if (event.key === 'Enter' && this.activeCodeIndex > -1) {
      event.preventDefault();
      const selectedCode = this.filteredProductCodes[this.activeCodeIndex];
      this.onSelectProductCode(selectedCode);
    }
  }

  scrollToActiveItem() {
    setTimeout(() => {
      const listItems = document.querySelectorAll('.code-list-item');
      const activeItem = listItems[this.activeCodeIndex] as HTMLElement;
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  //Item Code with prefix - Vishal
  prefixData!: any;
  readyProductPrefix!:any;

  getReadyProductPrefix() {
    this.customizeService.getCustomizeSettings().subscribe(
      (response: any) => {
        if (response?.data && response.data.length > 0) {
          this.prefixData = response.data[response.data.length - 1];
          this.readyProductPrefix = this.prefixData?.customize_ready_product_prefix;

          if (this.readyProductPrefix) {
            this.customizeService. getNextReadyProductCode(this.readyProductPrefix).subscribe({
              next: (res: any) => {
                if (res?.code) {
                  this.patchMetalCode(res.code);
                } else {
                  this.clearMetalCode();
                  console.warn('No serial code returned from backend.');
                }
              },
              error: (err) => {
                this.clearMetalCode();
                console.error('Error fetching metal serial code:', err);
              },
            });
          } else {
            this.clearMetalCode();
           // console.warn('Metal prefix missing in customize settings.');
          }
        } else {
          this.clearMetalCode();
          console.warn('No customize setting data found.');
        }
      },
      (error) => {
        this.clearMetalCode();
        console.error('Error fetching customize settings:', error);
      }
    );
  }


  generatedReadyProductCode: string | undefined;
  patchMetalCode(code: string) {
    this.generatedReadyProductCode = code;
    if (this.readyProductForm.get('rproduct_code')) {
      this.readyProductForm.patchValue({ rproduct_code: code });
    } else {
      console.warn('rproduct_code form control not found');
    }
  }

  clearMetalCode() {
    if (this.readyProductForm.get('rproduct_code')) {
      this.readyProductForm.patchValue({ rproduct_code: '' });
    }
  }

  packagingStackData: any[] = [];  // [id, name]
  filteredPackagingStack: any[] = [];
  showPackagingDropdown: boolean = false;
  highlightedIndex: number = -1;

  getPackagingStackDetails() {
    this.readyProductService.getPackagingStacks().subscribe((res: any) => {
      this.packagingStackData = res.data?.map((item: any) => [item.id, item.product_name]) || [];
      this.filteredPackagingStack = [...this.packagingStackData]; // initialize
    });
  }

  onSearchPackagingStack() {
    const searchValue = this.readyProductForm.get('rproduct_packaging_stock')?.value?.toLowerCase() || '';
    this.filteredPackagingStack = this.packagingStackData.filter(item =>
      item[1].toLowerCase().includes(searchValue)
    );
    this.showPackagingDropdown = true;
    this.highlightedIndex = -1;
  }

  selectPackagingStack(item: any) {
    const [id, name] = item;

    this.readyProductForm.patchValue({
      rproduct_packaging_stock: name
    });

    this.getPriceDataOfPackagingStack(id);

    this.showPackagingDropdown = false;
  }


  handleKeyDown(event: KeyboardEvent) {
    if (!this.showPackagingDropdown) return;

    const maxIndex = this.filteredPackagingStack.length - 1;

    if (event.key === 'ArrowDown') {
      this.highlightedIndex = (this.highlightedIndex + 1) > maxIndex ? 0 : this.highlightedIndex + 1;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.highlightedIndex = (this.highlightedIndex - 1) < 0 ? maxIndex : this.highlightedIndex - 1;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (this.highlightedIndex > -1) {
        this.selectPackagingStack(this.filteredPackagingStack[this.highlightedIndex]);
      } else {
        // Move focus to next field
        const nextElement = (event.target as HTMLElement).closest('form')?.querySelectorAll('input, select, textarea, button');
        if (nextElement) {
          const elements = Array.from(nextElement);
          const index = elements.indexOf(event.target as HTMLElement);
          if (index > -1 && index + 1 < elements.length) {
            (elements[index + 1] as HTMLElement).focus();
          }
        }
      }
      event.preventDefault();
    }
  }

  hideDropdown() {
    this.showPackagingDropdown = false;
  }

  getPriceDataOfPackagingStack(id: any) {
    forkJoin({
      product: this.stockGeneralService.getProductById(id),
      priceData: this.stockPriceService.getPriceDataByProductId(id)
    }).subscribe(({ product, priceData }) => {
      const rate = product?.data?.rate || 0;
      const purchasePrice = priceData?.data?.[0]?.purchase_price;
      this.readyProductForm.patchValue({
        rproduct_packaging_cost: purchasePrice ?? rate
      });
    });
  }

  getReadyProductList() {
    const params = new HttpParams()
      .set('st_product_code_type', 'ready_product')
      .set('ready_product_type', 'piece-wise');

    this.readyProductService.getReadyProducts(params).subscribe({
      next: (res: any) => {
        this.readyProductDataList = (res.data || [])
          .sort((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(-5).reverse();
      },
      error: (err) => {
        console.error('Error fetching ready product list:', err);
        this.notificationService.showError('Failed to load ready product list.', 'Error');
      }
    });
  }


  filteredSuppliers: { id: number; name: string }[] = [];
  supplierSearchText: string = '';
  sNameShowDropdown = false;
  activeIndex = -1;

  getSupplierList() {
    const queryParams = new HttpParams();
    this.userSupplierService.getUserSupplier(queryParams).subscribe((res: any) => {
      this.supplierList = res.data.map((supplier: any) => ({
        id: supplier.id,
        name: supplier.name
      }));
      this.filteredSuppliers = [...this.supplierList];
    });
  }

  filterSuppliers() {
    const search = this.supplierSearchText.toLowerCase();
    this.filteredSuppliers = this.supplierList.filter((supplier) =>
      supplier.name.toLowerCase().includes(search)
    );
    this.activeIndex = 0;
    this.sNameShowDropdown = true;
  }

  selectSupplier(index: number, supplier: { id: number; name: string }) {
    this.activeIndex = index; // Set selected index
    this.supplierSearchText = supplier.name;
    this.readyProductForm.get('rproduct_supplier_name')?.setValue(supplier.name);

    setTimeout(() => {
      this.sNameShowDropdown = false;
    });
  }

  sNameHandleKeyDown(event: KeyboardEvent) {
    if (!this.filteredSuppliers.length) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const nextInput = document.getElementById('supplier_code') as HTMLInputElement;
        nextInput?.focus();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex + 1) % this.filteredSuppliers.length;
      this.scrollToActive();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = (this.activeIndex - 1 + this.filteredSuppliers.length) % this.filteredSuppliers.length;
      this.scrollToActive();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const selected = this.filteredSuppliers[this.activeIndex];
      if (selected) {
        this.selectSupplier(this.activeIndex, selected);
      }

      // Move focus to the next input field
      const nextInput = document.getElementById('supplier_code') as HTMLInputElement;
      nextInput?.focus();
    }
  }


  scrollToActive() {
    setTimeout(() => {
      const items = this.supplierItems.toArray();
      const el = items[this.activeIndex];
      if (el) {
        el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  sNameHideDropdown() {
    setTimeout(() => {
      if (document.activeElement?.tagName.toLowerCase() !== 'li') {
        this.sNameShowDropdown = false;
      }
    }, 200);
  }
}
