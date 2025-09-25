import { AssembellyStoneService } from './../../../../Services/assembelly-stone.service';
import { FirmSelectionService } from './../../../../Services/firm-selection.service';
import { filter, forkJoin } from 'rxjs';
import { ProductService } from './../../../../Services/product.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../Services/notification.service';
import { ApiService } from '../../../../Services/api.service';
import { StockGeneralService } from './../../../../Services/Product_Creation/stock-general.service';
import { selectedFirmName } from './../../../../Services/firm-selection.service';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';
import { AfterViewInit } from '@angular/core';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-stock-stone',
  standalone: true,
  imports: [CustomSelectComponent, ReactiveFormsModule, NgFor, NgIf,FormsModule],
  templateUrl: './stock-stone.component.html',
  styleUrl: './stock-stone.component.css',
})
export class StockStoneComponent implements OnInit,AfterViewInit {
  updateStone(arg0: number) {
    throw new Error('Method not implemented.');
  }
  editingId: any;
  editButton: boolean = false;
  addButton: boolean = true;
  form: any;
  createdProduct: any;
  constructor(
    private productservice: ProductService,
    private fb: FormBuilder,
    private router: Router,
    public notificationService: NotificationService,
    private stockGeneralService: StockGeneralService,
    private firmSelectionService: FirmSelectionService,
    private tabCommService: TabCommunicationService,
    private sharedProductService:SharedProductService,
    private rawMetalService:RawMetalService,
    private assembellyStoneService:AssembellyStoneService
  ) { }
  stoneForm!: FormGroup;
  categoryTypes: any;
  selectedCategoryType: string = '';

  metalTypes: string[] = [];
  selectedMetalType: string = '';
  unitTypes: string[] = [];
  selectedUnitType: string = '';
  stoneDataList: any;
  productId: any;
  selectedFirm: any;
  newlyCreatedProduct: any;
  showCategoryTypeSelectTag = true;
  showCategoryTypeInputTag = false;
  StoneData: any;

  onCtrlEnter() {
    if (this.addButton) { // Only add if in 'add' mode
      this.addStoneDetail();
    }
  }
  ngOnInit(): void {
    this.getAssemblyStoneCodes();
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      this.selectedFirm = firm?.id;

      this.categoryTypes = this.getCategoryTypes();
      this.unitTypes = this.productservice.getUnitTypes();
      this.initForm();
      this.getstoneList();
      // this.generalProductDetail();
      this.getCurrentProductData();

      if(this.getIdFromSharedService()){
        this.getStoneListForEdit();
      }
    });
  }

  initForm() {
    this.productId = this.stockGeneralService.getProductId();
    const userId = this.productservice.getCurrentUserId();
    this.stoneForm = this.fb.group({
      code: ['', Validators.required],
      st_product_code_type: ['raw_stone'],
      include_in_total_price : true,
      // supplier_code: ['', Validators.required],
      stone_name: ['', Validators.required],
      categories: [null, Validators.required],
      quantity: ['', Validators.required],
      per_piece_weight: ['', Validators.required],
      unit: ['GM', Validators.required],
      total_weight: ['', Validators.required],
      per_piece_price: ['', Validators.required],
      total_price: ['', Validators.required],
      firm_id: [this.selectedFirm],
      user_id: [userId, Validators.required],
      product_id: [localStorage.getItem('createdProductId')],
    });

    this.stoneForm.valueChanges.subscribe(values => {
      const quantity = parseFloat(values.quantity) || 0;
      const weightPerPiece = parseFloat(values.per_piece_weight) || 0;
      const pricePerPiece = parseFloat(values.per_piece_price) || 0;

      const totalWeight = quantity * weightPerPiece;
      const totalPrice = quantity * pricePerPiece;

      this.stoneForm.patchValue({
        total_weight: totalWeight.toFixed(2),
        total_price: totalPrice.toFixed(2)
      }, { emitEvent: false });
    });
  }

  onSubmit() {
    if (this.stoneForm.valid) {
      this.addStoneDetail();
    } else {
      this.stoneForm.markAllAsTouched();
    }
  }

  getstoneList() {
    const productId = this.getProductId();

    if (!productId) {
      return;
    }

    this.productservice.getStonesByProductId(productId).subscribe((response: any) => {
      if (response?.data?.length) {
        this.stoneDataList = response.data.filter(
          (stone: any) => stone.product_id === productId
        );
      } else {
        this.stoneDataList = [];
      }
    });
  }

  getCategoryTypes() {
    this.productservice.getCategoryType().subscribe((res: any) => {
      const metal = res.data || [];


      const allCategories = metal.map(
        (item: any) => item.categories
      );


      this.categoryTypes = [...new Set(allCategories)];

      this.categoryTypes = [...this.categoryTypes];

    });
  }

  onCategoryChange(event: any) {
    const selectedValue = event?.target?.value || event;

    if (selectedValue === '+ Add Other') {
      this.stoneForm.get('categories')?.setValue('');

      this.showCategoryTypeSelectTag = false;
      this.showCategoryTypeInputTag = true;
    } else {

      this.selectedCategoryType = selectedValue;

    }
  }

  resetStoneField() {

    this.showCategoryTypeSelectTag = true;
    this.showCategoryTypeInputTag = false;
  }

  addStoneDetail() {
    this.productservice.CreateStone(this.stoneForm.value).subscribe(
      (response) => {
        const newStone = response.data;


        this.stoneDataList.unshift(newStone);


        this.stoneDataList.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

        this.notificationService.showSuccess(
          'Stone Created Successfully',
          'Success'
        );

        this.editButton = false;
        this.addButton = true;
        setTimeout(() => {
          this.getAssemblyStoneCodes();
        });
        this.onClear();
      },
      (error) => {
        this.notificationService.showError(
          'Failed to create stone. Please try again.',
          'Error'
        );
      }
    );
  }

  patchData(id: any) {
    this.productservice.getStonesList(id).subscribe((response: any) => {
      this.StoneData = response.data;
      this.editButton = true;
      this.addButton = false;

      this.stoneForm.patchValue(this.StoneData);
    });
    this.onClear();
  }

  editStone(): void {
    if (this.stoneForm.invalid) {
      this.notificationService.showError(
        'Form is invalid. Please check the fields.',
        'Validation Error'
      );
      return;
    }

    this.productservice.updateStone(this.StoneData.id, this.stoneForm.value).subscribe({
      next: (response) => {
        this.notificationService.showSuccess(
          'Stone data updated successfully.',
          'Success'
        );

        this.editButton = false;
        this.addButton = true;
        this.onClear();
        this.getstoneList();
        this.getCategoryTypes();
      },
      error: (error) => {
        this.notificationService.showError(
          'Failed to update stone. Please try again.',
          'Error'
        );
      },
    });
  }


  deleteStone(id: number) {
    this.productservice.deleteStone(id).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          'Stone Deleted Successfully',
          'Success'
        );
        this.getstoneList();
      },
      error: () => {
        this.notificationService.showError('Error deleting stone', 'Error');
      },
    });
  }

  onClear(): void {
    const firmId = this.stoneForm.get('firm_id')?.value;
    const productId = this.stoneForm.get('product_id')?.value;

    this.stoneForm.reset({
      unit: 'GM',
      include_in_total_price: true,
      firm_id: firmId,
      product_id: this.productId,
    });
    this.editButton = false;
    this.addButton = true;
  }

  getProductId() {
    this.productId = localStorage.getItem('createdProductId');
    return this.productId ? JSON.parse(this.productId) : null;
  }

  generalProductDetail() {
    this.newlyCreatedProduct = this.stockGeneralService.getCreatedProduct();
  }

  getCurrentProductData() {
    this.stockGeneralService.getProductById(localStorage.getItem('createdProductId')).subscribe((respone: any) => {
      this.newlyCreatedProduct = respone.data;
    })
  }


  goToAssemblyMetalTab() {
    this.tabCommService.setActiveTab(1);
  }


  goToPackagingTab() {
    this.tabCommService.setActiveTab(3);
  }

  //Get id from shared-product service
  getIdFromSharedService(){
    return this.sharedProductService.getProductId();
  }

  //this stone list is for update/see previous data (not current data)
  getStoneListForEdit() {
    const productIdStr = this.getIdFromSharedService();
    if (!productIdStr) return;

    const productId = Number(productIdStr);
    if (isNaN(productId)) {
      return;
    }

    this.productservice.getStonesByProductId(productId).subscribe((response: any) => {
      if (response?.data?.length) {
        this.stoneDataList = response.data.filter(
          (stone: any) => stone.product_id === productId
        );
      } else {
        this.stoneDataList = [];
      }
    });
  }

  //Here is the code for auto focus empty field as project requirement
  @ViewChild('code') codeField!: ElementRef;
  // @ViewChild('supplierCode') supplierCodeField!: ElementRef;
  @ViewChild('stoneName') stoneNameField!: ElementRef;
  @ViewChild('categories') categoriesField!: ElementRef;
  @ViewChild('quantity') quantityField!: ElementRef;
  @ViewChild('perPieceWeight') perPieceWeightField!: ElementRef;
  @ViewChild('unit') unitField!: ElementRef;
  @ViewChild('totalWeight') totalWeightField!: ElementRef;
  @ViewChild('perPiecePrice') perPiecePriceField!: ElementRef;
  @ViewChild('totalPrice') totalPriceField!: ElementRef;

  focusFirstEmptyField() {
    const controls = this.stoneForm.controls;

    if (!controls['code'].value?.toString().trim()) {
      this.codeField.nativeElement.focus();
      return;
    }

    // if (!controls['supplier_code'].value?.toString().trim()) {
    //   this.supplierCodeField.nativeElement.focus();
    //   return;
    // }

    if (!controls['stone_name'].value?.toString().trim()) {
      this.stoneNameField.nativeElement.focus();
      return;
    }

    if (!controls['categories'].value?.toString().trim()) {
      this.categoriesField.nativeElement.focus();
      return;
    }

    if (!controls['quantity'].value?.toString().trim()) {
      this.quantityField.nativeElement.focus();
      return;
    }

    if (!controls['per_piece_weight'].value?.toString().trim()) {
      this.perPieceWeightField.nativeElement.focus();
      return;
    }

    if (!controls['unit'].value?.toString().trim()) {
      this.unitField.nativeElement.focus();
      return;
    }

    if (!controls['total_weight'].value?.toString().trim()) {
      this.totalWeightField.nativeElement.focus();
      return;
    }

    if (!controls['per_piece_price'].value?.toString().trim()) {
      this.perPiecePriceField.nativeElement.focus();
      return;
    }

    if (!controls['total_price'].value?.toString().trim()) {
      this.totalPriceField.nativeElement.focus();
      return;
    }
  }

  ngAfterViewInit(): void {
    // setTimeout(() => {
    //   this.focusFirstEmptyField();
    // });
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

  //for getting product codes from stock general table and stockss table
    productCodes:any;
    productCodeList:any;
    rawMetalData:any;
    rawMetalProductCodes:any;
    stoneProductsList:any;

    getProductCodes() {
      let params = new HttpParams().set('firm_id', this.selectedFirm).set('st_code_type','raw_stone');
      this.rawMetalService.getStockData(params).subscribe((rawStones: any) => {
        const rawStoneCodes = Array.isArray(rawStones?.data)
          ? rawStones.data.map((p: any) => ({
              code: p.st_item_code,
              name: p.st_item_name,
            }))
          : [];

        const stoneCodeSet = new Set(this.stoneProductsList);

        this.productCodeList = rawStoneCodes.filter(
          (item: any) => !stoneCodeSet.has(item.code)
        );

      });
    }

    // Fetch assembly codes first, then load product codes
    getAssemblyStoneCodes() {
      // this.assembellyStoneService.getStoneList().subscribe((response: any) => {
      //   const dataArray = response.data || [];
      //   this.stoneProductsList = dataArray.map((item: any) => item.code);

      //   console.log('Assembly Stone Codes:', this.stoneProductsList);

      //   // Fetch and filter the product codes only after loading assembly codes
      //   this.getProductCodes();
      // });

      this.assembellyStoneService.getStonesByProductId(this.getProductId()).subscribe((response: any) => {
        const dataArray = response.data || [];
        this.stoneProductsList = dataArray.map((item: any) => item.code);

        // Fetch and filter the product codes only after loading assembly codes
        this.getProductCodes();
      });
    }

    @ViewChild('codeInput', { static: false }) codeInputRef!: ElementRef;

    filteredProductCodes: any;
    showCodeDropdown = false;
    typedCode = '';

    onCodeInputChange(event: Event) {
      if((event.target as HTMLInputElement).value!==''){
        this.selectProductCode((event.target as HTMLInputElement).value)
      } else {
        this.stoneForm.patchValue({
          categories: '',
          stone_name: '',
          quantity: '',
          per_piece_weight: '',
          total_weight: '',
          per_piece_price: '',
        });
      }

      const input = (event.target as HTMLInputElement).value.trim();
      this.typedCode = input;

      this.filteredProductCodes = this.productCodeList.filter((code: string) =>
        code.toLowerCase().includes(input.toLowerCase())
      );

      this.showCodeDropdown = this.filteredProductCodes.length > 0;
    }

    onFocusCode() {
      if (Array.isArray(this.productCodeList)) {
        this.filteredProductCodes = [...this.productCodeList];
        this.getAssemblyStoneCodes();
      } else {
        this.filteredProductCodes = [];
      }
      this.showCodeDropdown = true;
    }


    onBlurCode() {
      setTimeout(() => {
        this.showCodeDropdown = false;
      }, 200);
    }

    selectProductCode(code: string) {
      this.stoneForm.get('code')?.setValue(code);
      this.filteredProductCodes = [];
      this.showCodeDropdown = false;

      this.rawMetalService.searchByStCode(code).subscribe({
        next: (response) => {
          const dataArray = response.data || [];

          if (dataArray.length >= 1) {
            const rawMetalData = dataArray[0];
            if (rawMetalData) {
              this.stoneForm.patchValue({
                categories: rawMetalData.st_item_category.name,
                stone_name: rawMetalData.st_item_name,
                // quantity: rawMetalData.st_quantity,
                per_piece_weight: rawMetalData.st_subunit,
                // total_weight: rawMetalData.st_total_weight,
                per_piece_price: rawMetalData.st_sub_unit_price,
              });
            }
          } else {
            this.patchProductCodeRelatedDataWithGeneralDetails(code);
          }
        },
        error: (err) => {
          this.patchProductCodeRelatedDataWithGeneralDetails(code);
        }
      });
    }


    activeCodeIndex = -1;

    onCodeKeyDown(event: KeyboardEvent) {
      if (!this.showCodeDropdown || this.filteredProductCodes.length === 0) return;

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
        this.selectProductCode(selectedCode.code);
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

    patchProductCodeRelatedDataWithGeneralDetails(code: string) {
      this.rawMetalService.searchByUniqueCodeSku(code).subscribe({
        next: (response) => {
          const dataArray = response.data || [];
          if (dataArray.length >= 1) {
            const productData = dataArray[0];
            if (productData) {
              this.stoneForm.patchValue({
                categories: productData.category?.name,
                stone_name: productData.product_name,
                quantity: '',
                per_piece_weight: '',
                total_weight: '',
              });
            }
          }
        },
        error: (err) => {
        }
      });
    }

}
