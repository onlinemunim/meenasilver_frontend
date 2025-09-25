import { ProductService } from './../../../../Services/product.service';
import { Component, ElementRef, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../Services/notification.service';
import { HttpParams } from '@angular/common/http';
import { ApiService } from '../../../../Services/api.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MetalService } from './../../../../Services/metal.service';
import { StockGeneralService } from './../../../../Services/Product_Creation/stock-general.service';
import { FirmSelectionService,selectedFirmName } from './../../../../Services/firm-selection.service';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';
import { AfterViewInit } from '@angular/core';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-stock-metal',
  imports: [CustomSelectComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './stock-metal.component.html',
  styleUrl: './stock-metal.component.css',
})
export class StockMetalComponent implements OnInit, AfterViewInit {
  newlyCreatedProduct: any;
  createdProduct: any;
  showMetalTypeSelectTag = true;
  showMetalTypeInputTag = false;

  showArticalTypeSelectTag = true;
  showArticalTypeInputTag = false;
  productForm: any;

  constructor(
    private fb: FormBuilder,
    public notificationService: NotificationService,
    private MetalService: MetalService,
    private firmSelectionService: FirmSelectionService,
    private stockGeneralService: StockGeneralService,
    private tabCommService: TabCommunicationService,
    private sharedProductService:SharedProductService,
    private rawMetalService:RawMetalService
  ) {}

  metalDataList: any[] = [];
  activatedRoute: any;
  firmId: any;
  router = inject(Router);
  metals: any;
  editingId: any;

  metalTypes: any;
  selectedMetalType: string = '';
  selectedMaterialType: string = '';

  unitTypes: string[] = [];
  selectedUnitType: string = '';

  articleTypes: any;
  selectedArticleType: string = '';

  metalform!: FormGroup;
  editButton: boolean = false;
  addButton: boolean = true;
  productId: any;
  selectedFirm: any;

  onCtrlEnter() {
    if (this.addButton) { // Only add if in 'add' mode
      this.addMetal();
    }
  }
  ngOnInit(): void {
    this.getAssemblyMetalProductCode();
    this.getMetalList();
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      this.selectedFirm = firm?.id;
      this.getMetalTypes();
      this.getArticaleType();
      this.unitTypes = this.MetalService.getUnitTypes();
      this.initForm();
      this.getCurrentProductData();

      //for edit old data
      if(this.getIdFromSharedService()){
        this.getMetalListForEditOldData()
      }
    });
  }

  initForm() {
    this.productId = this.stockGeneralService.getProductId();
    const userId = this.getCurrentUserId();

    this.metalform = this.fb.group({
      code: [''],
      // supplier_code: [''],
      metal_type: ['', Validators.required],
      artical_name: ['', Validators.required],
      quantity: ['', Validators.required],
      per_piece_weight: [''],
      unit: ['GM', Validators.required],
      total_weight: [''],
      per_piece_price: [''],
      total_price: [''],
      include_in_total_price: true,
      firm_id: [this.selectedFirm],
      user_id: this.getCurrentUserId(),
      product_id: [localStorage.getItem('createdProductId')],
    });
    this.metalform.valueChanges.subscribe(values => {
      const quantity = parseFloat(values.quantity) || 0;
      const weightPerPiece = parseFloat(values.per_piece_weight) || 0;
      const pricePerPiece = parseFloat(values.per_piece_price) || 0;

      const totalWeight = quantity * weightPerPiece;
      const totalPrice = quantity * pricePerPiece;

      this.metalform.patchValue({
        total_weight: totalWeight.toFixed(2),
        total_price: totalPrice.toFixed(2)
      }, { emitEvent: false });
    });
  }

  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '';
  }

  getMetalTypes() {
    this.MetalService.getMetalList().subscribe((res: any) => {
      const metal = res.data || [];
      const allCategories = metal.map((item: any) => item.metal_type);

      const hardcoded = ['Silver', 'Gold', 'Platinum'];
      const combined = [...allCategories, ...hardcoded];

      const seen = new Set<string>();
      const unique = combined.filter(type => {
        const lower = (type || '').toLowerCase();
        if (!lower || seen.has(lower)) return false;
        seen.add(lower);
        return true;
      });

      this.metalTypes = unique;
    });
  }


  getArticaleType() {
    this.MetalService.getArticleTypes().subscribe((res: any) => {
      const metal = res.data || [];
      const allCategories = metal.map((item: any) => item.artical_name);
      this.articleTypes = [, ...new Set(allCategories)];
    });
  }

  onMaterialCategoryChange(event: any) {
    const selectedValue = event?.target?.value || event;
    if (selectedValue === '+ Add Other') {
      this.metalform.get('metal_type')?.setValue('');
      this.showMetalTypeSelectTag = false;
      this.showMetalTypeInputTag = true;
    } else {
      this.selectedMaterialType = selectedValue;
    }
  }

  onArticalChange(event: any) {
    const selectedValue = event?.target?.value || event;
    if (selectedValue === '+ Add Other') {
      this.metalform.get('artical_name')?.setValue('');
      this.showArticalTypeSelectTag = false;
      this.showArticalTypeInputTag = true;
    } else {
      this.selectedArticleType = selectedValue;
    }
  }

  resetArticalField() {
    this.showArticalTypeSelectTag = true;
    this.showArticalTypeInputTag = false;
  }

  resetCategoryField() {
    this.showMetalTypeSelectTag = true;
    this.showMetalTypeInputTag = false;
  }

  addMetal() {
    this.MetalService.CreateMetal(this.metalform.value).subscribe(
      (response: any) => {
        const newMetal = response.data;
        this.metalDataList.unshift(newMetal);
        this.metalDataList.sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        this.notificationService.showSuccess('Metal Created Successfully!', 'Success');
        setTimeout(() => {
          this.getAssemblyMetalProductCode();
        });
        this.onClear();
        this.editButton = false;
        this.addButton = true;
      },
      (error: any) => {
        this.notificationService.showError('Failed to create metal. Please try again.', 'Error');
      }
    );
  }

  getMetalList() {
    const productId = this.getProductId();
    if (!productId) return;

    this.MetalService.getMetalsByProductId(productId).subscribe(
      (response: any) => {
        if (response?.data?.length) {
          this.metalDataList = response.data
            .filter((metal: any) => metal.product_id === productId)
            .sort((a: any, b: any) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        } else {
          this.metalDataList = [];
        }
      },
      (error) => {
      }
    );
  }

  patchData(id: any) {
    this.MetalService.getMetalsList(id).subscribe((response: any) => {
      this.metalform.patchValue(response.data);
      this.editingId = id;
      this.editButton = true;
      this.addButton = false;
    });
    this.onClear();
  }

  editMetal() {
    if (this.metalform.invalid) {
      this.notificationService.showError('Form is invalid. Please check the fields.', 'Validation Error');
      return;
    }

    this.MetalService.updateMetal(this.editingId, this.metalform.value).subscribe(
      (response: any) => {
        this.notificationService.showSuccess('Metal Updated Successfully!', 'Success');
        this.getMetalList();
        this.editButton = false;
        this.addButton = true;
        this.onClear();
      },
      (error: any) => {
        this.notificationService.showError('Failed to update metal. Please try again.', 'Error');
      }
    );
  }

  deleteMetal(id: any) {
    this.MetalService.deleteMetal(id).subscribe({
      next: (response: any) => {
        this.notificationService.showSuccess('Deleted successfully', 'Metal deleted');
        this.getMetalList();
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to delete', 'Error');
      }
    });
  }


  onSubmit() {
    if (this.metalform.valid) {
      this.addMetal();
    } else {
      console.log('Form is invalid');
    }
  }

  onClear() {
    this.metalform.reset({
      unit: 'GM',
    });
    const currentProductId = this.getProductId();
    this.metalform.patchValue({
      include_in_total_price: true,
      firm_id: this.selectedFirm,
      user_id: this.getCurrentUserId(),
      product_id: currentProductId
    });
    this.editButton = false;
    this.addButton = true;
  }


  getProductId() {
    this.productId = localStorage.getItem('createdProductId');
    return this.productId ? JSON.parse(this.productId) : null;
  }

  getCurrentProductData() {
    this.stockGeneralService.getProductById(localStorage.getItem('createdProductId')).subscribe((respone: any) => {
      this.newlyCreatedProduct = respone.data;
    });
  }

  goToGeneralDetailsTab() {
    this.tabCommService.setActiveTab(0);
  }

  goToAssemblyStoneTab() {
    this.tabCommService.setActiveTab(2);
  }

   //Get id from shared-product service
   getIdFromSharedService(){
    return this.sharedProductService.getProductId();
  }

  //this is list for edit existing product data
  getMetalListForEditOldData() {
    const productIdStr = this.getIdFromSharedService();
  if (!productIdStr) return;

  const productId = Number(productIdStr);
  if (isNaN(productId)) {
    console.error('Invalid product ID:', productIdStr);
    return;
  }

    this.sharedProductService.getMetalsByProductId(productId).subscribe(
      (response: any) => {
        if (response?.data?.length) {
          this.metalDataList = response.data
            .filter((metal: any) => metal.product_id === productId)
            .sort((a: any, b: any) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );
        } else {
          this.metalDataList = [];
        }
      },
      (error) => {
        console.error('Failed to fetch metal list:', error);
      }
    );
  }

  //Here is the code for auto focus empty field as project requirement
  @ViewChild('code') codeField!: ElementRef;
  // @ViewChild('supplierCode') supplierCodeField!: ElementRef;
  @ViewChild('metalType') metalTypeField!: ElementRef;
  @ViewChild('articalName') articalNameField!: ElementRef;
  @ViewChild('quantity') quantityField!: ElementRef;
  @ViewChild('perPieceWeight') perPieceWeightField!: ElementRef;
  @ViewChild('unit') unitField!: ElementRef;
  @ViewChild('totalWeight') totalWeightField!: ElementRef;
  @ViewChild('perPiecePrice') perPiecePriceField!: ElementRef;
  @ViewChild('totalPrice') totalPriceField!: ElementRef;

  focusFirstEmptyField() {
    const controls = this.metalform.controls;

    if (!controls['code'].value?.toString().trim() && this.codeField?.nativeElement) {
      this.codeField.nativeElement.focus();
      return;
    }

    // if (!controls['supplier_code'].value?.toString().trim() && this.supplierCodeField?.nativeElement) {
    //   this.supplierCodeField.nativeElement.focus();
    //   return;
    // }

    if (!controls['metal_type'].value?.toString().trim() && this.metalTypeField?.nativeElement) {
      this.metalTypeField.nativeElement.focus();
      return;
    }

    if (!controls['artical_name'].value?.toString().trim() && this.articalNameField?.nativeElement) {
      this.articalNameField.nativeElement.focus();
      return;
    }

    if (!controls['quantity'].value?.toString().trim() && this.quantityField?.nativeElement) {
      this.quantityField.nativeElement.focus();
      return;
    }

    if (!controls['per_piece_weight'].value?.toString().trim() && this.perPieceWeightField?.nativeElement) {
      this.perPieceWeightField.nativeElement.focus();
      return;
    }

    if (!controls['unit'].value?.toString().trim() && this.unitField?.nativeElement) {
      this.unitField.nativeElement.focus();
      return;
    }

    if (!controls['total_weight'].value?.toString().trim() && this.totalWeightField?.nativeElement) {
      this.totalWeightField.nativeElement.focus();
      return;
    }

    if (!controls['per_piece_price'].value?.toString().trim() && this.perPiecePriceField?.nativeElement) {
      this.perPiecePriceField.nativeElement.focus();
      return;
    }

    if (!controls['total_price'].value?.toString().trim() && this.totalPriceField?.nativeElement) {
      this.totalPriceField.nativeElement.focus();
      return;
    }
  }



  ngAfterViewInit(): void {
    // Delay focus slightly to ensure DOM is ready
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
  assemblyProductCodes:any;

  getProductCodes() {
    let params = new HttpParams().set('firm_id', this.selectedFirm).set('st_code_type','raw_metal');
    this.rawMetalService.getStockData(params).subscribe((rawMetals: any) => {
      const rawMetalCodes = Array.isArray(rawMetals?.data)
        ? rawMetals.data.map((p: any) => ({
            code: p.st_item_code,
            name: p.st_item_name,
          }))
        : [];

      const assemblyCodeSet = new Set(this.assemblyProductCodes);

      this.productCodeList = rawMetalCodes.filter(
        (item: any) => !assemblyCodeSet.has(item.code)
      );

    });
  }


  getAssemblyMetalProductCode() {
    // this.MetalService.getMetalList().subscribe((response: any) => {
    //   const dataArray = response.data || [];
    //   this.assemblyProductCodes = dataArray.map((item: any) => item.code);
    //   console.log('Assembly Product Codes:', this.assemblyProductCodes);

      // Now load the product codes after getting assembly codes
    //   this.getProductCodes();
    // });

    this.MetalService.getMetalsByProductId(this.getProductId()).subscribe((response: any) => {
      const dataArray = response.data || [];
      this.assemblyProductCodes = dataArray.map((item: any) => item.code);

      // Now load the product codes after getting assembly codes
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
       this.metalform.patchValue({
         code: '',
         metal_type: '',
         artical_name: '',
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
      this.getAssemblyMetalProductCode();
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
    this.metalform.get('code')?.setValue(code);
    this.filteredProductCodes = [];
    this.showCodeDropdown = false;

    this.rawMetalService.searchByStCode(code).subscribe({
      next: (response) => {
        const dataArray = response.data || [];

        if (dataArray.length >= 1) {
          const rawMetalData = dataArray[0];
          if (rawMetalData) {
            this.metalform.patchValue({
              metal_type: rawMetalData.st_metal_type,
              artical_name: rawMetalData.st_item_name,
              // quantity: rawMetalData.st_quantity,
              per_piece_weight: rawMetalData.st_subunit,
              // total_weight: rawMetalData.st_total_weight,
              per_piece_price: rawMetalData.st_sub_unit_price,
            });
          }
        } else {
          // Only call general details if raw metal data is not found
          this.patchProductCodeRelatedDataWithGeneralDetails(code);
        }
      },
      error: (err) => {
        console.error('Error fetching raw metal data:', err);
        // Optionally still try general if raw fails completely
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
            this.metalform.patchValue({
              // code: productData.unique_code_sku,
              metal_type: productData.metal_type,
              artical_name: productData.product_name,
              quantity: '',
              per_piece_weight: '',
              total_weight: '',
            });
          }
        }
      },
      error: (err) => {
        console.error('Error fetching product data:', err);
      }
    });
  }

}
