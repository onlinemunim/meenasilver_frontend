import { StockGeneralService } from './../../../../Services/Product_Creation/stock-general.service';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirmSelectionService, selectedFirmName } from '../../../../Services/firm-selection.service';
import { HttpParams } from '@angular/common/http';
import Swal from 'sweetalert2';
import { NotificationService } from '../../../../Services/notification.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import { firstValueFrom, forkJoin, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';
import { Router } from '@angular/router';
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service'; // <-- 1. IMPORT THE SERVICE

@Component({
  selector: 'app-stock-general',
  standalone: true,
  imports: [CustomSelectComponent, ReactiveFormsModule, NgIf, NgFor, NgClass],
  templateUrl: './stock-general.component.html',
  styleUrl: './stock-general.component.css',
})
export class StockGeneralComponent implements OnInit, OnDestroy { // <-- 2. IMPLEMENT OnDestroy
  sockGeneralDetails!: FormGroup;
  productImages: any;
  selectedFirm: selectedFirmName | null = null;
  selectedImages: (File | null)[] = [null, null, null, null, null];
  fileUploadError: { [index: number]: string } = {};

  // --- 3. UPDATED: State Management for Field Visibility ---
  private destroy$ = new Subject<void>();
  visibleFields: Set<string> = new Set(); // Use a Set for fast lookups. Renamed from your HTML's `visibleFields.includes` for clarity.

  allPackagings: any;
  newlyCreatedProduct: any = null;
  submitButton: boolean = true;
  updateButton: boolean = false;
  productData: any;
  lastEnteredMetalType: any;
  typedSubCategoryReadonly: any;

  constructor(
    private fb: FormBuilder,
    private stockGeneralService: StockGeneralService,
    private firmSelectionService: FirmSelectionService,
    private tabCommService: TabCommunicationService,
    private notificationService: NotificationService,
    private router: Router,
    private sharedProductService: SharedProductService,
    private cdr: ChangeDetectorRef,
    private customizeService: CustomizeService // <-- 4. INJECT THE SERVICE
  ) {
    // --- 5. REMOVED: The incorrect localStorage logic is no longer needed ---
    // const savedFields = localStorage.getItem('selectedFields');
    // if (savedFields) {
    //   this.visibleFields = JSON.parse(savedFields);
    // }
  }

  // for product/metal types
  selectedProdMetalType: string = '';
  prodMetalTypes: any;
  MetalproductSelectTag = true;
  MetalproductInputTag = false;

  // for Gender
  genderTypes: string[] = ['Male', 'Female', 'Kids', 'Unisex'];
  selectedGender: string = '';

  // for unit
  unitTypes: string[] = [ 'GM (GRAM)', 'KG (KILOGRAM)', 'MG (MILLIGRAM)', 'CT (CARAT)', 'LTR (LITRE)', 'RT (RATTI)', 'PP (PER PIECE)', 'PER (PERCENT)', 'BOX (BOX)', 'LADI (LADI)', 'PETI (PETI)', 'JAR (JARS)', 'HEGR (HANGER)', 'POCH (POUCH)', 'BORA (BORA)', 'COIL (COIL)', 'FT (FEET)', 'IN (INCHES)', 'PRT (PORTION)', 'CASE (CASE)', 'EACH (EACH)', 'CPS (CAPSULES)', 'PADS (PADS)', 'REEL (REEL)', 'BSTR (BLISTER)', 'PAD (PAD)', 'PRS (PAIRS)', 'QTL (QUINTAL)', 'ROL (ROLLS)', 'SET (SETS)', 'SQF (SQUARE FEET)', 'SQM (SQUARE METERS)', 'SQY (SQUARE YARDS)', 'TBS (TABLETS)', 'TGM (TEN GROSS)', 'THD (THOUSANDS)', 'TON (TONNES)', 'TUB (TUBES)', 'UGS (US GALLONS)', 'YDS (YARDS)', 'OTH (OTHERS)', 'HRS (HOURS)', 'MINS (MINUTES)', 'MTON (METRIC TON)', 'BCK (BUCKETS)', 'GLS (GLASSES)', 'PLT (PLATES)', 'CTS (CARATS)', 'STRP (STRIPS)', 'CFT (CUBIC FOOT)', 'VIAL (VIALS)', 'BAG (BAGS)', 'BAL (BALE)', 'BDL (BUNDLES)', 'BKL (BUCKLES)', 'BOU (BILLIONS OF UNITS)', 'BTL (BOTTLES)', 'BUN (BUNCHES)', 'CAN (CANS)', 'CBM (CUBIC METER)', 'CCM (CUBIC CENTIMETER)', 'CMS (CENTIMETER)', 'CTN (CARTONS)', 'DOZ (DOZEN)', 'DRM (DRUM)', 'GGR (GREAT GROSS)', 'GRS (GROSS)', 'GYD (GROSS YARDS)', 'KLR (KILOLITRE)', 'KMR (KILOMETRE)', 'MLT (MILLILITRE)', 'MTR (METERS)', 'NOS (NUMBERS)', 'PAC (PACKS)', 'CNT (CENTS)', 'RFT (RUNNING FOOT)', 'RIM (RIM)', 'TIN (TIN)', 'CDI (CHUDI)', 'PTTA (PATTA)', 'KIT (KIT)', 'CUFT (CUBIC FEET)', 'RMT (RUNNING METER)', 'MM (MILLIMETER)', 'AMP (AMPOULE)', 'PAIR (PAIR)', 'YEAR (YEARS)', 'MON (MONTHS)', 'DAY (DAYS)', 'NIGT (NIGHTS)', 'WEEK (WEEKS)', 'PRSN (PERSONS)', ];
  selectedUnits: string = '';

  // for Sub unit
  subunitTypes: string[] = [ 'GM (Gram)', 'KG (KiloGram)', 'MG (MilliGram)', 'CT (Carat)', ];
  selectedSubunits: string = '';

  makingChargUnits: string[] = ['PER', 'AMT', 'GM', 'KG', 'MG'];
  selectedMaking: string = '';

  // for discount types
  discountTypes: string[] = ['PER', 'AMT', 'GM', 'KG', 'MG'];
  selectedDiscounts: string = '';

  // for clarity
  clarityTypes: string[] = ['clarity'];
  selectedClarity: string = '';

  onCtrlEnter() {
    if (this.submitButton) {
      this.onSubmit();
    }
  }

  ngOnInit(): void {
    this.initForm();

    if (this.getIdFromSharedService()) {
      this.patchValuesForEdit();
    }

    this.customizeService.generalFieldsVisibility$
      .pipe(takeUntil(this.destroy$))
      .subscribe(visibleFieldsSet => {
        this.visibleFields = visibleFieldsSet;
        this.cdr.detectChanges();
      });

    this.getCurrentProductData();

    this.firmSelectionService.selectedFirmName$
      .pipe(takeUntil(this.destroy$))
      .subscribe((firm: any) => {
        this.selectedFirm = firm?.id;
        this.sockGeneralDetails.patchValue({ firm_id: this.selectedFirm });
        this.restoreFormDataFromSessionStorage();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isVisible(fieldKey: string): boolean {
    if (this.visibleFields.size === 0) {
      // This is a robust fallback. If for any reason the settings haven't loaded,
      // show all fields to prevent a blank form. This is especially true
      // for required fields that should always be present.
      const requiredFields = ['model_number', 'unique_code_sku', 'type', 'group', 'category_id', 'product_name', 'metal_type', 'purity'];
      return requiredFields.includes(fieldKey);
    }
    // Once settings are loaded, use the Set for checking visibility.
    return this.visibleFields.has(fieldKey);
  }

  initForm(metalType: string = '') {
    this.sockGeneralDetails = this.fb.group({
      id: [''],
      model_number: ['', [Validators.required,Validators.maxLength(50)]],
      unique_code_sku: ['', [Validators.required, Validators.maxLength(100)]],
      type: ['Product',[Validators.required, Validators.maxLength(100)]],
      brand_name: ['', [Validators.maxLength(100)]],
      supplier_code: ['', [Validators.maxLength(100)]],
      group: ['', [Validators.required,Validators.maxLength(100)]],
      category_id: [''],
      sub_category_id: [''],
      product_name: ['', [Validators.required,Validators.maxLength(100)]],
      hsn_code: ['', [Validators.required,Validators.maxLength(100)]],
      metal_type: ['Silver', [Validators.required, Validators.maxLength(100)]],
      purity: ['92.5', [Validators.maxLength(100)]],
      stamp: ['', [Validators.maxLength(100)]],
      unit: ['GM (GRAM)'],
      subunit: ['', [Validators.maxLength(100)]],
      conversion: [''],
      size: ['', [Validators.maxLength(100)]],
      gender: ['', [Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(65535)]],
      labour_charges: ['', [Validators.pattern(/^\d{1,12}(\.\d{1,2})?$/)]],
      making_charges: ['', [Validators.pattern(/^\d{1,12}(\.\d{1,2})?$/)]],
      making_charges_unit: ['GM', [Validators.maxLength(100)]],
      thread_weight: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      total_thread_price: ['', [Validators.pattern(/^\d{1,12}(\.\d{1,2})?$/)]],
      actual_weight: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      min_weight: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      max_weight: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      min_size: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      max_size: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      sell_dis_code: ['', [Validators.maxLength(100)]],
      min_disc: ['', ],
      max_disc: ['', ],
      disc_type: ['', [Validators.maxLength(100)]],
      color: ['', [Validators.maxLength(100)]],
      clarity: ['', [Validators.maxLength(100)]],
      height: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      length: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      width: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      per_piece_weight: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      total_wt: ['', [Validators.pattern(/^\d{1,12}(\.\d{1,4})?$/)]],
      quantity: [''],
      rate: ['', [Validators.pattern(/^\d{1,12}(\.\d{1,4})?$/)]],
      per_piece_price: ['', [Validators.pattern(/^\d{1,12}(\.\d{1,2})?$/)]],
      per_gm_labour: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)]],
      per_piece_labour: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)]],
      per_gm_shipping: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)]],
      per_piece_shipping: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)]],
      total_per_piece_price: ['', [Validators.pattern(/^\d{1,15}(\.\d{1,2})?$/)]],
      stone_type: [''],
      stone_in_each_mala: [''],
      total_mala: [''],
      per_stone_price: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)]],
      each_stone_price: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)]],
      each_stone_wt: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,4})?$/)]],
      total_stone_wt: ['', [Validators.pattern(/^\d{1,12}(\.\d{1,4})?$/)]],
      per_gram_price: ['', [Validators.pattern(/^\d{1,10}(\.\d{1,2})?$/)]],
      st_product_code_type: ['general'],
      user_id: [localStorage.getItem('createdProductId')],
      firm_id: [this.selectedFirm,],
    });
  }

  /**
   * IMPORTANT: Renamed `isVisible` to reflect what your HTML is using.
   * This is the bridge between your service and your template.
   */
  includes(fieldKey: string): boolean {
    // If the set is empty (e.g., on initial load before settings arrive), show everything as a robust fallback.
    // This prevents a blank screen if the settings API is slow.
    if (this.visibleFields.size === 0) {
      return true;
    }
    return this.visibleFields.has(fieldKey);
  }

  async onSubmit() {
    await this.createCategoryIfNotExist();
    await this.createSubCategoryIfNotExist();
    this.addProductDetails();
  }

  addProductDetails() {
    const formData = new FormData();

    Object.keys(this.sockGeneralDetails.controls).forEach((key) => {
      const value = this.sockGeneralDetails.get(key)?.value;
      formData.append(key, value ?? '');
    });

    const imageKeys = [ 'product_image', 'product_image_2', 'product_image_3', 'product_image_4', 'product_image_5', ];
    this.selectedImages.forEach((file, index) => {
      if (file) {
        formData.append(imageKeys[index], file);
      }
    });

    this.stockGeneralService.createProducts(formData).subscribe({
      next: (response: any) => {
        const productId = response.data?.id;
        localStorage.setItem('createdProductId', productId.toString());
        this.stockGeneralService.setProductId(productId);
        this.stockGeneralService.setCreatedProduct(response.data);

        this.stockGeneralService.getProductById(productId).subscribe({
          next: (product) => {
            this.newlyCreatedProduct = product.data;
          },
          error: (err) => {
            console.error('Error fetching new product:', err);
          },
        });

        this.notificationService.showSuccess( 'Your product has been added successfully!', 'Product Added' );
        this.clearForm();
        this.goToAssemblyMetalPartsTab();
      },
      error: (err) => {
        console.error('Error while creating product:', err);
        this.notificationService.showError( 'Something went wrong while adding the product.', 'Error' );
      },
    });
  }

  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '';
  }

  clearForm() {
    this.sockGeneralDetails.reset({
      type: 'Product',
      unit: 'GM (GRAM)',
      making_charges_unit: 'GM',
      purity: '92.5',
      metal_type: 'Silver',
      st_product_code_type: 'general',
      firm_id: this.selectedFirm,
      category_id: null,
      sub_category_id: null
    });

    this.typedCategory = '';
    this.typedSubCategory = '';
    this.getMetalTypeToSetDefaultWhichEnterLastTime();
    this.imagePreviews = [ '/assets/images/stock/product-2.png', '/assets/images/stock/product-2.png', '/assets/images/stock/product-3.png', '/assets/images/stock/product-4.png', '/assets/images/stock/product-5.png', ];
    this.selectedImages = [null, null, null, null, null];
    this.fileUploadError = {};
    this.makeFieldsEditable([ 'category_id', 'product_name', 'hsn_code', 'metal_type', 'unit', ]);
  }

  imagePreviews: (string | ArrayBuffer | null)[] = [ '/assets/images/stock/product-2.png', '/assets/images/stock/product-2.png', '/assets/images/stock/product-3.png', '/assets/images/stock/product-4.png', '/assets/images/stock/product-5.png', ];

  onImageSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];

      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.fileUploadError[index] = 'Only JPEG and PNG files are allowed.';
        input.value = '';
        return;
      } else {
        this.fileUploadError[index] = '';
      }
      this.selectedImages[index] = file;

      const reader = new FileReader();
      reader.onload = () => { this.imagePreviews[index] = reader.result; };
      reader.readAsDataURL(file);
    }
  }

  saveFormDataToSessionStorage() {
    sessionStorage.setItem( 'stockGeneralFormData', JSON.stringify(this.sockGeneralDetails.value) );
  }

  restoreFormDataFromSessionStorage() {
    this.sockGeneralDetails.valueChanges.subscribe(() => {
      this.saveFormDataToSessionStorage();
    });
  }

  getCurrentProductData() {
    const storedValue = localStorage.getItem('createdProductId');
    const productId = parseInt(storedValue || '', 10);
    if (productId) {
      this.stockGeneralService
        .getProductById(productId)
        .subscribe((respone: any) => {
          this.newlyCreatedProduct = respone.data;
        });
    }
  }

  goToAssemblyMetalPartsTab() {
    const productId = localStorage.getItem('createdProductId');
    if (productId === 'null') {
      this.warningMsg();
      return;
    }
    this.tabCommService.setActiveTab(1);
  }

  // --- ALL YOUR DROPDOWN AND OTHER UI LOGIC REMAINS UNCHANGED ---
  // (filteredStockTypes, onTypeInputChange, onKeyDown, etc.)
  // (category logic, subcategory logic, etc.)
  // (group logic, warning messages, etc.)
  // (edit logic, patch logic, etc.)

  // Note: All of your complex dropdown and form interaction logic below this point
  // is preserved exactly as you wrote it. No changes were needed there.

    filteredStockTypes: any;
  typedType: string = '';
  selectingFromDropdown = false;
  showDropdown = false;
  highlightedIndex: number = -1;

  @ViewChild('typeInput', { static: false }) typeInputRef!: ElementRef;

  onTypeInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.typedType = input;
    this.highlightedIndex = -1;
    this.fetchFilteredTypes(input);
  }

  onKeyDown(event: KeyboardEvent) {
    const maxIndex = this.filteredStockTypes?.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.highlightedIndex < maxIndex) {
        this.highlightedIndex++;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.highlightedIndex > 0) {
        this.highlightedIndex--;
      }
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (
        this.highlightedIndex >= 0 &&
        this.filteredStockTypes[this.highlightedIndex]
      ) {
        this.selectFilteredType(this.filteredStockTypes[this.highlightedIndex]);
        this.focusNext(event);
      } else if (this.typedType.trim()) {
        this.selectFilteredType(this.typedType.trim());
        this.focusNext(event);
      }
    }
  }

  onFocusType() {
    this.showDropdown = true;
    this.fetchFilteredTypes('');
    this.highlightedIndex = -1;
  }

  onBlurType() {
    setTimeout(() => {
      if (!this.selectingFromDropdown) {
        const trimmed = this.typedType.trim();
        if (trimmed) {
          this.sockGeneralDetails.get('type')?.setValue(trimmed);
        }
        this.showDropdown = false;
        this.highlightedIndex = -1;
      }
    }, 150);
  }

  fetchFilteredTypes(search: string) {
    const staticTypes = ['Product', 'Service', 'Subscription', 'Packaging', 'Packaging Stack'];

    this.stockGeneralService.searchTypes(search).subscribe((res: any) => {
      const types = res.data || [];
      const dynamicTypes = types.map((item: any) => item.type);
      const combinedTypes = [...staticTypes, ...dynamicTypes];
      const uniqueTypesMap = new Map<string, string>();
      for (const type of combinedTypes) {
        const lower = type.toLowerCase();
        if (!uniqueTypesMap.has(lower)) {
          uniqueTypesMap.set(lower, type);
        }
      }
      this.filteredStockTypes = Array.from(uniqueTypesMap.values()).filter(type =>
        type.toLowerCase().includes(search.toLowerCase())
      );
    });
  }


  selectFilteredType(type: string) {
    this.selectingFromDropdown = true;
    this.sockGeneralDetails.get('type')?.setValue(type);
    this.typeInputRef.nativeElement.value = type;
    this.highlightedIndex = -1;
    this.showDropdown = false;
    setTimeout(() => {
      this.typeInputRef?.nativeElement.blur();
      this.selectingFromDropdown = false;
    }, 100);
  }

  @ViewChild('categoryInputRef', { static: false })
  categoryInputRef!: ElementRef;
  highlightedCategoryIndex: number = -1;

  filteredCategories: any[] = [];
  typedCategory: string = '';
  showCategoryDropdown = false;
  selectingCategory = false;


  onCategoryInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.typedCategory = input;
    this.highlightedCategoryIndex = -1;
    const group = this.sockGeneralDetails.get('group')?.value;
    this.fetchCategories(input, group);
  }


  onCategoryKeyDown(event: KeyboardEvent) {
    const maxIndex = this.filteredCategories?.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.highlightedCategoryIndex < maxIndex) {
        this.highlightedCategoryIndex++;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.highlightedCategoryIndex > 0) {
        this.highlightedCategoryIndex--;
      }
    } else if (event.key === 'Enter') {
      if (this.highlightedCategoryIndex >= 0) {
        const selected = this.filteredCategories[this.highlightedCategoryIndex];
        if (selected) {
          this.selectCategory(selected);
        }
      } else {
        this.createCategoryIfNotExist();
      }
    }
  }

  onCategoryFocus() {
    this.showCategoryDropdown = true;
    const group = this.sockGeneralDetails.get('group')?.value;
    this.fetchCategories('', group);
    this.highlightedCategoryIndex = -1;
  }

  createCategoryIfNotExist(): Promise<void> {
    return new Promise((resolve) => {
      const selectedId = this.sockGeneralDetails.get('category_id')?.value;

      if (selectedId) {
        this.showCategoryDropdown = false;
        this.selectingCategory = false;
        resolve();
      } else {
        this.addCategoryIfNew(this.typedCategory).then(() => {
          this.onCategoryBlur();
          resolve();
        });
      }
    });
  }

  onCategoryBlur(): void {
    this.sockGeneralDetails.controls['category_id'].markAsTouched();
    setTimeout(() => {
      this.showCategoryDropdown = false;
      this.selectingCategory = false;
    }, 50);
  }

  fetchCategories(search: string, group?: string) {
    if (!group) return;
    this.stockGeneralService.getCategoriesByGroup(group).subscribe((res: any) => {
      const all = res.data || [];
      this.filteredCategories = all
        .filter((cat: any) =>
          cat.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
    });
  }

  selectCategory(category: any) {
    this.selectingCategory = true;
    this.sockGeneralDetails.get('category_id')?.setValue(category.id);
    this.sockGeneralDetails.get('category_id')?.markAsTouched();
    this.typedCategory = category.name;
    this.showCategoryDropdown = false;
    this.filteredCategories = [];
  }

  addCategoryIfNew(name: string): Promise<any> {
    const trimmedName = name.trim();
    if (!trimmedName) return Promise.resolve();
    const selectedId = this.sockGeneralDetails.get('category_id')?.value;
    if (selectedId) return Promise.resolve();
    const group = this.sockGeneralDetails.get('group')?.value;
    const payload = { name: trimmedName, firm_id: this.selectedFirm, group: group || '', };
    return firstValueFrom(this.stockGeneralService.createCategory(payload)).then((res: any) => {
      if (res?.data?.id) {
        this.sockGeneralDetails.get('category_id')?.setValue(res.data.id);
        this.typedCategory = res.data.name;
      }
    }).catch(err => {
      console.error('Category creation failed', err);
    });
  }

  @ViewChild('subCategoryInputRef', { static: false }) subCategoryInputRef!: ElementRef;
  typedSubCategory: string = '';
  filteredSubCategories: any[] = [];
  showSubCategoryDropdown = false;
  selectingSubCategory = false;
  highlightedSubIndex: number = -1;

  onSubCategoryInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.typedSubCategory = input;
    this.fetchSubCategories(input);
  }

  onSubCategoryFocus() {
    this.showSubCategoryDropdown = true;
    this.fetchSubCategories('');
  }

  onSubCategoryKeydown(event: KeyboardEvent) {
    const listLength = this.filteredSubCategories.length;
    if (!this.showSubCategoryDropdown || listLength === 0) return;
    switch (event.key) {
      case 'ArrowDown':
        this.highlightedSubIndex = (this.highlightedSubIndex + 1) % listLength;
        this.scrollSubCategoryIntoView();
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.highlightedSubIndex = (this.highlightedSubIndex - 1 + listLength) % listLength;
        this.scrollSubCategoryIntoView();
        event.preventDefault();
        break;
      case 'Enter':
        if (this.highlightedSubIndex >= 0) {
          this.selectSubCategory(this.filteredSubCategories[this.highlightedSubIndex]);
          event.preventDefault();
        }
        break;
      case 'Escape':
        this.showSubCategoryDropdown = false;
        this.highlightedSubIndex = -1;
        break;
    }
  }

  createSubCategoryIfNotExist(): Promise<void> {
    return new Promise((resolve) => {
      const selectedId = this.sockGeneralDetails.get('sub_category_id')?.value;
      if (selectedId || this.selectingSubCategory) {
        this.showSubCategoryDropdown = false;
        this.selectingSubCategory = false;
        resolve();
      } else {
        this.addSubCategoryIfNew(this.typedSubCategory).then(() => {
          this.onSubCategoryBlur();
          resolve();
        });
      }
    });
  }

  onSubCategoryBlur(): void {
    setTimeout(() => {
      this.showSubCategoryDropdown = false;
      this.selectingSubCategory = false;
    }, 50);
  }

  fetchSubCategories(search: string) {
    const categoryId = this.sockGeneralDetails.get('category_id')?.value;
    if (!categoryId) return;
    const params = new HttpParams().set('category_id', categoryId);
    this.stockGeneralService.getSubCategories(params).subscribe((res: any) => {
      const all = res.data || [];
      this.filteredSubCategories = all
        .filter((sc: any) =>
          sc.name.toLowerCase().includes(search.toLowerCase())
        )
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
    });
  }

  selectSubCategory(sub: any) {
    this.selectingSubCategory = true;
    this.sockGeneralDetails.get('sub_category_id')?.setValue(sub.id);
    this.typedSubCategory = sub.name;
    this.showSubCategoryDropdown = false;
    this.filteredSubCategories = [];
  }

  addSubCategoryIfNew(name: string): Promise<any> {
    const categoryId = this.sockGeneralDetails.get('category_id')?.value;
    if (!name.trim() || !categoryId) return Promise.resolve();
    const exists = this.filteredSubCategories.some( (sub) => sub.name.toLowerCase() === name.toLowerCase() );
    if (!exists) {
      const payload = { name: name.trim(), category_id: categoryId, firm_id: this.selectedFirm, };
      return firstValueFrom( this.stockGeneralService.createSubCategory(payload) ).then((res: any) => {
        this.sockGeneralDetails.get('sub_category_id')?.setValue(res.data.id);
        this.typedSubCategory = res.data.name;
      });
    } else {
      const existing = this.filteredSubCategories.find( (sub) => sub.name.toLowerCase() === name.toLowerCase() );
      if (existing) {
        this.sockGeneralDetails.get('sub_category_id')?.setValue(existing.id);
      }
      return Promise.resolve();
    }
  }

  @ViewChild('metalTypeInput', { static: false }) metalTypeInputRef!: ElementRef;
  highlightedMetalIndex: number = -1;
  filteredMetalTypes: any;
  typedMetalType: string = '';
  showMetalDropdown = false;
  selectingMetalFromDropdown = false;

  onMetalTypeInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.typedMetalType = input;
    this.fetchFilteredMetalTypes(input);
  }

  onMetalTypeKeydown(event: KeyboardEvent) {
    const listLength = this.filteredMetalTypes?.length || 0;
    if (!this.showMetalDropdown || listLength === 0) return;
    switch (event.key) {
      case 'ArrowDown':
        if (this.highlightedMetalIndex < listLength - 1) {
          this.highlightedMetalIndex++;
          this.scrollMetalTypeIntoView();
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
        if (this.highlightedMetalIndex > 0) {
          this.highlightedMetalIndex--;
          this.scrollMetalTypeIntoView();
        }
        event.preventDefault();
        break;
      case 'Enter':
        if ( this.highlightedMetalIndex >= 0 && this.highlightedMetalIndex < listLength ) {
          this.selectFilteredMetalType( this.filteredMetalTypes[this.highlightedMetalIndex] );
          event.preventDefault();
        }
        break;
    }
  }

  scrollMetalTypeIntoView() {
    setTimeout(() => {
      const list = document.querySelectorAll( 'ul[aria-label="metal-type-dropdown"] > li' );
      const item = list[this.highlightedMetalIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }, 0);
  }

  onFocusMetalType() {
    this.showMetalDropdown = true;
    this.fetchFilteredMetalTypes('');
  }

  scrollSubCategoryIntoView() {
    setTimeout(() => {
      const list = document.querySelectorAll( 'ul[aria-label="sub-category-dropdown"] > li' );
      const item = list[this.highlightedSubIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }, 0);
  }

  onBlurMetalType() {
    setTimeout(() => {
      this.showMetalDropdown = false;
      this.selectingMetalFromDropdown = false;
      this.highlightedMetalIndex = -1;
    }, 200);
  }

  fetchFilteredMetalTypes(search: string) {
    const typed = this.typedMetalType.trim().toLowerCase();
    this.stockGeneralService.searchMetalTypes(search).subscribe((res: any) => {
      const types = res.data || [];
      const normalizedSet = new Set<string>();
      const filtered: string[] = [];
      const hardcodedTypes = ['Silver', 'Gold', 'Platinum'];
      for (const hardcoded of hardcodedTypes) {
        const lower = hardcoded.toLowerCase();
        if (lower !== typed && !normalizedSet.has(lower)) {
          normalizedSet.add(lower);
          filtered.push(hardcoded);
        }
      }
      for (const item of types) {
        const rawType = item.metal_type || item.type || '';
        const normalized = String(rawType).trim();
        if (!normalized) continue;
        const lower = normalized.toLowerCase();
        if (lower === typed || normalizedSet.has(lower)) continue;
        normalizedSet.add(lower);
        filtered.push(normalized);
      }
      this.filteredMetalTypes = filtered;
    });
  }

  selectFilteredMetalType(type: string) {
    this.selectingMetalFromDropdown = true;
    this.sockGeneralDetails.get('metal_type')?.setValue(type);
    this.typedMetalType = type;
    this.filteredMetalTypes = [];
    this.showMetalDropdown = false;
  }

  @ViewChild('clarityInput', { static: false }) clarityInputRef!: ElementRef;
  filteredClarities: any;
  typedClarity: string = '';
  showClarityDropdown = false;
  selectingClarityFromDropdown = false;
  highlightedClarityIndex: number = -1;

  onClarityInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.typedClarity = input;
    this.fetchFilteredClarities(input);
  }

  onFocusClarity() {
    this.showClarityDropdown = true;
    this.highlightedClarityIndex = -1;
    this.fetchFilteredClarities('');
  }

  onBlurClarity() {
    setTimeout(() => {
      if (this.selectingClarityFromDropdown) {
        this.selectingClarityFromDropdown = false;
      } else {
        this.showClarityDropdown = false;
        this.highlightedClarityIndex = -1;
      }
    }, 150);
  }

  onDropdownMouseDown() {
    this.selectingClarityFromDropdown = true;
  }

  onClarityKeydown(event: KeyboardEvent) {
    const listLength = this.filteredClarities?.length || 0;
    if (!this.showClarityDropdown || listLength === 0) return;
    switch (event.key) {
      case 'ArrowDown':
        if (this.highlightedClarityIndex < listLength - 1) {
          this.highlightedClarityIndex++;
          this.scrollClarityIntoView();
        }
        event.preventDefault();
        break;
      case 'ArrowUp':
        if (this.highlightedClarityIndex > 0) {
          this.highlightedClarityIndex--;
          this.scrollClarityIntoView();
        }
        event.preventDefault();
        break;
      case 'Enter':
        if ( this.highlightedClarityIndex >= 0 && this.highlightedClarityIndex < listLength ) {
          this.selectFilteredClarity( this.filteredClarities[this.highlightedClarityIndex] );
          event.preventDefault();
        }
        break;
      case 'Escape':
        this.showClarityDropdown = false;
        this.highlightedClarityIndex = -1;
        break;
    }
  }

  scrollClarityIntoView() {
    setTimeout(() => {
      const items = document.querySelectorAll( 'ul[aria-label="clarity-dropdown"] > li' );
      const item = items[this.highlightedClarityIndex] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }, 0);
  }

  fetchFilteredClarities(search: string) {
    this.stockGeneralService.searchClarities(search).subscribe((res: any) => {
      const types = res.data || [];
      this.filteredClarities = [ ...new Set(types.map((item: any) => item.clarity || item.type)), ];
    });
  }

  selectFilteredClarity(clarity: string) {
    this.sockGeneralDetails.get('clarity')?.setValue(clarity);
    this.typedClarity = clarity;
    this.filteredClarities = [];
    this.showClarityDropdown = false;
    this.selectingClarityFromDropdown = false;
  }

  warningMsg() {
    Swal.fire({
      html: `<div style="display: flex; align-items: center; gap: 10px; color: white;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="yellow" viewBox="0 0 24 24"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg><span>Fill general Details form first</span></div>`,
      background: '#000',
      position: 'top',
      showConfirmButton: false,
      showCloseButton: false,
      timer: 1000,
      customClass: { popup: 'auto-size-alert', },
      width: 'fit-content',
    });
  }

  @ViewChild('groupInput', { static: false }) groupInputRef!: ElementRef;
  filteredGroups: any;
  typedGroup: string = '';
  showGroupDropdown = false;
  selectingGroupFromDropdown = false;
  categoryData: any;
  typedCategoryReadonly = false;
  readonlyFields: string[] = [];
  selectedGroupIndex: number = -1;

  onGroupInputChange(event: Event) {
    const input = (event.target as HTMLInputElement).value.trim();
    this.typedGroup = input;
    this.fetchFilteredGroups(input).subscribe((groups: string[]) => {
      this.filteredGroups = groups;
      const isMatch = groups.some(group => group.toLowerCase() === input.toLowerCase());
      if (input === '') {
        this.makeFieldsEditable([ 'category_id', 'product_name', 'hsn_code', 'metal_type', 'unit', ]);
        this.sockGeneralDetails.patchValue({ category_id: '', product_name: '', hsn_code: '', metal_type: 'Silver', unit: '', });
        this.typedCategory = '';
      } else if (isMatch) {
        this.onGroupChange(input);
      } else {
        this.makeFieldsEditable([ 'category_id', 'product_name', 'hsn_code', 'metal_type', 'unit', ]);
        this.sockGeneralDetails.patchValue({ category_id: '', product_name: '', hsn_code: '', metal_type: 'Silver', unit: '', });
        this.typedCategory = '';
      }
    });
  }

  onFocusGroup() {
    this.selectedGroupIndex = -1;
    this.showGroupDropdown = true;
    this.fetchFilteredGroups('').subscribe((groups: string[]) => {
      this.filteredGroups = groups;
      this.cdr.detectChanges();
    });
  }

  onGroupKeyDown(event: KeyboardEvent) {
    if (!this.filteredGroups || this.filteredGroups.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (this.selectedGroupIndex < this.filteredGroups.length - 1) {
        this.selectedGroupIndex++;
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.selectedGroupIndex > 0) {
        this.selectedGroupIndex--;
      }
    } else if (event.key === 'Enter') {
      if ( this.selectedGroupIndex >= 0 && this.selectedGroupIndex < this.filteredGroups.length ) {
        const selected = this.filteredGroups[this.selectedGroupIndex];
        this.selectFilteredGroup(selected);
        this.onGroupChange(selected);
      }
    }
  }

  onBlurGroup() {
    setTimeout(() => {
      this.showGroupDropdown = false;
      const currentInput = this.typedGroup.trim();
      const isExactMatch = this.filteredGroups.some((group: string) => group.toLowerCase() === currentInput.toLowerCase());
      if (currentInput && !isExactMatch && !this.selectingGroupFromDropdown) {}
      this.selectingGroupFromDropdown = false;
    }, 200);
  }

  allGroups: string[] = [];

  fetchFilteredGroups(search: string): Observable<string[]> {
    return this.stockGeneralService.searchGroups(search).pipe(
      map((res: any) => {
        const groups: { group: string | null }[] = res.data || [];
        const validGroups = groups.map(item => item.group).filter((group): group is string => !!group && typeof group === 'string');
        const uniqueGroups = [...new Set(validGroups)];
        this.allGroups = uniqueGroups.map(g => g.toLowerCase());
        return uniqueGroups;
      })
    );
  }

  selectFilteredGroup(group: string) {
    this.onGroupChange(group);
    this.selectingGroupFromDropdown = true;
    this.sockGeneralDetails.get('group')?.setValue(group);
    this.typedGroup = group;
    this.filteredGroups = [];
    this.showGroupDropdown = false;
  }

  createNewGroup(group: string) {
    this.stockGeneralService.createGroup({ group }).subscribe({
      next: () => { this.fetchFilteredGroups(''); },
      error: (err) => { console.error('Error creating group:', err); },
    });
  }

  onGroupChange(selectedGroup: string) {
    this.stockGeneralService.getGroupRelatedData(selectedGroup).subscribe((response: any) => {
      const data = response.data?.[0];
      if (data) {
        const categoryId = data.category?.id || data.category_id;
        const categoryName = data.category?.name || '';
        this.sockGeneralDetails.patchValue({ category_id : categoryId, product_name: data.product_name, hsn_code: data.hsn_code, metal_type: data.metal_type, unit: data.unit, });
        this.selectedGroupIndex = -1;
        this.typedCategory = categoryName;
        this.fetchCategories('', selectedGroup);
        this.makeFieldsReadOnly(['hsn_code', 'metal_type']);
      } else {
        this.sockGeneralDetails.patchValue({ product_name: '', hsn_code: '', metal_type: 'Silver', unit: '', });
        this.typedCategory = '';
        this.filteredCategories = [];
        this.makeFieldsEditable([ 'category_id', 'product_name', 'hsn_code', 'metal_type', 'unit', ]);
      }
    });
  }

  makeFieldsReadOnly(fields: string[]) {
    fields.forEach((field) => { this.sockGeneralDetails.get(field)?.disable(); });
    if (fields.includes('category_id')) { this.typedCategoryReadonly = true; }
    this.readonlyFields = fields;
  }

  makeFieldsEditable(fields: string[]) {
    fields.forEach((field) => { this.sockGeneralDetails.get(field)?.enable(); });
    if (fields.includes('category_id')) { this.typedCategoryReadonly = false; }
    this.readonlyFields = this.readonlyFields.filter( (f) => !fields.includes(f) );
  }

  isReadOnly(fieldName: string): boolean {
    return this.readonlyFields.includes(fieldName);
  }

  getIdFromSharedService() {
    return this.sharedProductService.getProductId();
  }

  patchValuesForEdit() {
    this.stockGeneralService
      .getProductById(this.getIdFromSharedService())
      .subscribe((response: any) => {
        const productData = response.data;
        if (productData) {
          this.sockGeneralDetails.patchValue({ ...productData, ...productData.product_config_data, category_id: productData.category?.id, sub_category_id: productData.sub_category?.id, metal_type: productData.metal_type, });
          this.sockGeneralDetails.get('model_number')?.disable();
          this.sockGeneralDetails.get('unique_code_sku')?.disable();
          this.typedCategory = productData.category?.name || '';
          this.typedSubCategory = productData.sub_category?.name || '';
          this.imagePreviews = [ productData.product_image || '/assets/images/stock/product-2.png', productData.product_image_2 || '/assets/images/stock/product-2.png', productData.product_image_3 || '/assets/images/stock/product-3.png', productData.product_image_4 || '/assets/images/stock/product-4.png', productData.product_image_5 || '/assets/images/stock/product-5.png', ];
          this.updateButton = true;
          this.submitButton = false;
        }
      });
  }

  patchCurrentValuesForEdit(CurrentProductId: any) {
    this.stockGeneralService
      .getProductById(CurrentProductId)
      .subscribe((response: any) => {
        const productData = response.data;
        if (productData) {
          this.sockGeneralDetails.patchValue({ ...productData, ...productData.product_config_data, category_id: productData.category?.id, });
          this.sockGeneralDetails.get('model_number')?.disable();
          this.sockGeneralDetails.get('unique_code_sku')?.disable();
          this.typedCategory = productData.category?.name || '';
          this.imagePreviews = [ productData.product_image || '/assets/images/stock/product-2.png', productData.product_image_2 || '/assets/images/stock/product-2.png', productData.product_image_3 || '/assets/images/stock/product-3.png', productData.product_image_4 || '/assets/images/stock/product-4.png', productData.product_image_5 || '/assets/images/stock/product-5.png', ];
          this.updateButton = true;
          this.submitButton = false;
        }
      });
    this.sharedProductService.setProductId(CurrentProductId);
  }

  async editProduct() {
    await this.createCategoryIfNotExist();
    this.stockGeneralService.editProduct(this.getIdFromSharedService(), this.sockGeneralDetails.getRawValue() ).subscribe( (response: any) => {
      this.notificationService.showSuccess( 'Product updated successfully!', 'Success' );
      this.getCurrentProductData();
    },
    (error: any) => {
      this.notificationService.showError( 'Failed to update product. Please try again.', 'Error' );
    } );
  }

  async submitAndClear() {
    await this.createCategoryIfNotExist();
    await this.createSubCategoryIfNotExist();
    const formData = new FormData();
    Object.keys(this.sockGeneralDetails.controls).forEach((key) => {
      const value = this.sockGeneralDetails.get(key)?.value;
      formData.append(key, value ?? '');
    });
    const imageKeys = [ 'product_image', 'product_image_2', 'product_image_3', 'product_image_4', 'product_image_5', ];
    this.selectedImages.forEach((file, index) => {
      if (file) { formData.append(imageKeys[index], file); }
    });
    this.stockGeneralService.createProducts(formData).subscribe({
      next: (response: any) => {
        const productId = response.data?.id;
        localStorage.setItem('createdProductId', productId.toString());
        this.stockGeneralService.setProductId(productId);
        this.stockGeneralService.setCreatedProduct(response.data);
        this.stockGeneralService.getProductById(productId).subscribe({
          next: (product) => { this.newlyCreatedProduct = product.data; },
          error: (err) => { console.error('Error fetching new product:', err); },
        });
        this.notificationService.showSuccess( 'Your product has been added successfully!', 'Product Added' );
        this.clearForm();
      },
      error: (err) => {
        console.error('Error while creating product:', err);
        this.notificationService.showError( 'Something went wrong while adding the product.', 'Error' );
      },
    });
  }

  deleteGeneralProduct(id: any) {
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      this.stockGeneralService.deleteProduct(id).subscribe({
        next: () => {
          this.notificationService.showSuccess( 'The product has been deleted.', 'Deleted' );
          this.router.navigate(['/general-list']);
        },
        error: () => {
          this.notificationService.showError( 'Something went wrong while deleting.', 'Error' );
        },
      });
    }
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    const target = keyboardEvent.target as HTMLElement;
    const form = target.closest('form');
    if (!form) return;
    const focusable = Array.from( form.querySelectorAll<HTMLElement>('input, select, textarea, button') ).filter(el => {
      const isHiddenInput = el.tagName === 'INPUT' && (el as HTMLInputElement).type === 'hidden';
      return ( !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden' && !isHiddenInput );
    });
    const index = focusable.indexOf(target);
    if (index > -1 && index + 1 < focusable.length) {
      focusable[index + 1].focus();
    }
  }

  getMetalTypeToSetDefaultWhichEnterLastTime() {
    let firmId = this.selectedFirm?.id ?? '';
    let params = new HttpParams().set('firm_id', firmId.toString());
    this.stockGeneralService.getProducts(params).subscribe((res: any) => {
      const productData = res.data || [];
      if (productData.length > 0) {
        const lastRow = productData[productData.length - 1];
        this.lastEnteredMetalType = lastRow.metal_type || '';
        this.sockGeneralDetails.patchValue({ metal_type: this.lastEnteredMetalType, })
      } else {
        this.lastEnteredMetalType = '';
      }
    });
  }
}
