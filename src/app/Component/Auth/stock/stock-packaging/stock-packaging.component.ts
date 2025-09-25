import { RawMetalService } from './../../../../Services/Raw_Metal/raw-metal.service';
import { StockGeneralService } from './../../../../Services/Product_Creation/stock-general.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { PackagingService } from '../../../../Services/Product_Creation/packaging.service';
import { NgFor, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FirmSelectionService, selectedFirmName } from '../../../../Services/firm-selection.service';
import { forkJoin } from 'rxjs';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import { NotificationService } from '../../../../Services/notification.service';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';
import { AfterViewInit } from '@angular/core';
import { StockPriceService } from '../../../../Services/Product_Creation/stock-price.service';

@Component({
  selector: 'app-stock-packaging',
  standalone: true,
  imports: [ReactiveFormsModule, CustomSelectComponent, NgFor, NgIf, NgxPaginationModule],
  templateUrl: './stock-packaging.component.html',
  styleUrl: './stock-packaging.component.css',
})
export class StockPackagingComponent implements OnInit,AfterViewInit {
  selectedFirm: selectedFirmName | null = null;
  packagingForm!: FormGroup;
  packagingData: any;
  packagingDetails: any;
  page: number = 1;
  data: any;
  id: any;
  packageId: any;
  editButton: boolean = false;
  addButton: boolean = true;
  packagingDetail: any;

  productId: any;
  productCodeForSelectQty: any;
  metalTypeData: any;
  metalTypeNames: any;
  showMetalTypeSelectTag = true;
  showMetalTypeInputTag = false;
  metalMaterialNames: any;
  showMaterialNameSelectInputTag: boolean = false;
  showMaterialNameSelectTag: boolean = true;
  metalSize: any;
  showSizeSelectTag: boolean = true;
  showSizeInputTag: boolean = false;
  createdProduct: any;
  newlyCreatedProduct: any;
  packagingDataListQty: any;
  packagingDetailforQty: any;
  showQuantityListFieldForDevide: boolean = false;

  constructor(
    private fb: FormBuilder,
    private packagingService: PackagingService,
    private firmSelectionService: FirmSelectionService,
    private stockGeneralService: StockGeneralService,
    private tabCommService: TabCommunicationService,
    private notificationService: NotificationService,
    private sharedProductService:SharedProductService,
    private rawMetalService:RawMetalService,
    private stockPriceService:StockPriceService
  ) {}


  materialTypes!: string[];
  selectedMaterialType: string = '';

  onCtrlEnter() {
    if (this.addButton) { // Only add if in 'add' mode
      this.addDetail();
    }
  }
  getMetalTypes() {
    this.packagingService.getPackagings().subscribe((res: any) => {
      const allPackagings = res.data || [];
      const allCategories = allPackagings.map((item: any) => item.material_categories);
      this.metalTypeNames = [...new Set(allCategories)];
      this.materialTypes = [ ...this.metalTypeNames];
    });
  }

  onMaterialCategoryChange(event: any) {
    const selectedValue = event?.target?.value || event;
    if (selectedValue === '+ Add Other') {
      this.packagingForm.get('material_categories')?.setValue('');
      this.showMetalTypeSelectTag = false;
      this.showMetalTypeInputTag = true;
    } else {
      this.selectedMaterialType = selectedValue;
    }
  }

  resetCategoryField() {
    this.showMetalTypeSelectTag = true;
    this.showMetalTypeInputTag = false;
  }

  materialName!: string[];
  selectedMaterialName: string = '';

  getAllMaterialNames() {
    this.packagingService.getPackagings().subscribe((res: any) => {
      const allPackagings = res.data || [];
      const allMaterialNames = allPackagings.map((item: any) => item.material_name);
      this.metalMaterialNames = [...new Set(allMaterialNames)];
      this.materialName = [ ...this.metalMaterialNames];
    });
  }

  onMaterialNameChange(event: any) {
    const selectedValue = event?.target?.value || event;
    if (selectedValue === '+ Add Other') {
      this.packagingForm.get('material_name')?.setValue('');
      this.showMaterialNameSelectTag = false;
      this.showMaterialNameSelectInputTag = true;
    } else {
      this.selectedMaterialName = selectedValue;
    }
  }

  resetMaterialNameField() {
    this.showMaterialNameSelectTag = true;
    this.showMaterialNameSelectInputTag = false;
  }

  materialSize!: string[];
  selectedMaterialSize: string = '';

  getSize() {
    this.packagingService.getPackagings().subscribe((res: any) => {
      const allPackagings = res.data || [];
      const allSizes = allPackagings.map((item: any) => item.size);
      this.metalSize = [...new Set(allSizes)];
      this.materialSize = [...this.metalSize];
    });
  }

  resetSizeField() {
    this.showSizeSelectTag = true;
    this.showSizeInputTag = false;
  }

  ngOnInit() {
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      this.selectedFirm = firm?.id;
      this.initForm();
    });

    this.getMetalTypes();
    this.getAllPackaging();
    this.getAllMaterialNames();
    this.getSize();
    this.getCurrentProductData();

    //get old packaging data for see or edit
    if(this.getIdFromSharedService()){
      this.getOldPackagingsForEdit();
    }
    this.getProductCodes();
  }

  initForm() {
    const userId = this.getCurrentUserId();
    this.packagingForm = this.fb.group({
      id: [''],
      product_code:[''],
      // supplier_code: [''],
      material_categories: [''],
      include_in_total_price: true,
      material_name: [''],
      size: [''],
      quantity: [''],
      per_piece: [''],
      total_price: [''],
      add_name: [''],
      user_id: [userId],
      firm_id: [this.selectedFirm],
      product_id: [localStorage.getItem('createdProductId')],
    });

    this.packagingForm.valueChanges.subscribe((values: { quantity: string, per_piece: string, add_name: string }) => {
      const quantity = parseFloat(values.quantity) || 0;
      const pricePerPiece = parseFloat(values.per_piece) || 0;
      const addName = parseFloat(values.add_name);

      let totalPrice = quantity * pricePerPiece;

      if (!isNaN(addName) && addName !== 0) {
        totalPrice = pricePerPiece / addName;
      }

      this.packagingForm.patchValue({
        total_price: totalPrice.toFixed(2),
      }, { emitEvent: false });
    });
  }

  onSubmit() {}


  addDetail() {
    this.packagingService.createPackaging(this.packagingForm.value).subscribe(
      (data: any) => {
        this.packagingData = data.data;
        this.editButton = false;
        this.addButton = true;
        this.showMetalTypeSelectTag = true;
        this.showMetalTypeInputTag = false;
        this.clearForm();
        this.getAllPackaging();
        this.getMetalTypes();
        this.getAllMaterialNames();
        this.getSize();

        this.notificationService.showSuccess('Packaging details added successfully.', 'Success');
      },
      (error: any) => {
        this.notificationService.showError('Failed to add packaging details. Please try again.', 'Error');
      }
    );
  }


  clearForm() {
    const firmId = this.packagingForm.get('firm_id')?.value;
    this.productId = this.packagingForm.get('product_id')?.value;
    this.packagingForm.reset();

    this.editButton = false;
    this.addButton = true;
    this.showMetalTypeSelectTag = true;
    this.showMetalTypeInputTag = false;
    this.showMaterialNameSelectTag = true;
    this.showMaterialNameSelectInputTag = false;
    this.showSizeSelectTag = true;
    this.showSizeInputTag = false;

    this.packagingForm.patchValue({
      add_name: '',
      include_in_total_price: true,
      firm_id: firmId,
      product_id: this.productId,
    });
    // setTimeout(() => this.focusFirstEmptyField());
  }

  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '';
  }

  getAllPackaging() {
    const productId = this.getProductId();
    if (!productId) return;

    this.packagingService.getPackagingListByProductId(productId).subscribe((response: any) => {
      if (response?.data?.length) {
        this.packagingDetail = response.data.filter((p: any) => p.product_id === productId);
        console.log("packaging data is",this.packagingDetail);
      } else {
        this.packagingDetail = [];
      }
    });
  }

  deleteItem(id: any) {
    this.packagingService.deletePackaging(id).subscribe(
      () => {
        this.notificationService.showSuccess('Packaging item deleted successfully.', 'Deleted');
        this.clearForm();
        this.getAllPackaging();
      },
      (error: any) => {
        this.notificationService.showError('Failed to delete packaging item. Please try again.', 'Error');
      }
    );
  }


  patchData(id: any) {
    this.packagingService.getPackaging(id).subscribe((response: any) => {
      this.packagingData = response.data;
      this.editButton = true;
      this.addButton = false;
      this.packagingForm.patchValue(this.packagingData);
      this.packageId = this.packagingData.id;
    });
  }

  editDetail() {
    this.packagingService.updatePackaging(this.packageId, this.packagingForm.value).subscribe(
      () => {
        this.notificationService.showSuccess('Packaging data updated successfully.', 'Updated');
        this.editButton = false;
        this.addButton = true;
        this.clearForm();
        this.getAllPackaging();
        this.getMetalTypes();
        this.getAllMaterialNames();
        this.getSize();
      },
      (error: any) => {
        this.notificationService.showError('Failed to update packaging data. Please try again.', 'Error');
      }
    );
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

  goToAssemblyStoneTab() {
    this.tabCommService.setActiveTab(2);
  }

  goToFeatureTab() {
    this.tabCommService.setActiveTab(4);
  }

  //Get id from shared-product service
  getIdFromSharedService(){
    return this.sharedProductService.getProductId();
  }

  getOldPackagingsForEdit() {
    const productIdStr = this.getIdFromSharedService();
    if (!productIdStr) return;

    const productId = Number(productIdStr);
    if (isNaN(productId)) {
      console.error('Invalid product ID:', productIdStr);
      return;
    }

    this.packagingService.getPackagingListByProductId(productId).subscribe((response: any) => {
      if (response?.data?.length) {
        this.packagingDetail = response.data.filter((p: any) => p.product_id === productId);
      } else {
        this.packagingDetail = [];
      }
    });
  }

  //Here is the code for auto focus empty field as project requirement
  @ViewChild('supplierCode') supplierCodeField!: ElementRef;
  @ViewChild('materialCategories') materialCategoriesField!: ElementRef;
  @ViewChild('materialName1') materialNameField!: ElementRef;
  @ViewChild('size') sizeField!: ElementRef;
  @ViewChild('quantity') quantityField!: ElementRef;
  @ViewChild('perPiece') perPieceField!: ElementRef;
  @ViewChild('totalPrice') totalPriceField!: ElementRef;

  focusFirstEmptyField() {
    const controls = this.packagingForm.controls;

    // if (controls['supplier_code'] && !controls['supplier_code'].value?.toString().trim()) {
    //   this.supplierCodeField?.nativeElement.focus();
    //   return;
    // }

    if (controls['material_categories'] && !controls['material_categories'].value?.toString().trim()) {
      this.materialCategoriesField?.nativeElement?.focus();
      return;
    }

    if (controls['material_name'] && !controls['material_name'].value?.toString().trim()) {
      this.materialNameField?.nativeElement?.focus();
      return;
    }

    if (controls['size'] && !controls['size'].value?.toString().trim()) {
      this.sizeField?.nativeElement?.focus();
      return;
    }

    if (controls['quantity'] && !controls['quantity'].value?.toString().trim()) {
      this.quantityField?.nativeElement?.focus();
      return;
    }

    if (controls['per_piece'] && !controls['per_piece'].value?.toString().trim()) {
      this.perPieceField?.nativeElement?.focus();
      return;
    }

    if (controls['total_price'] && !controls['total_price'].value?.toString().trim()) {
      this.totalPriceField?.nativeElement?.focus();
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

  productCodes: any;
  productCodeList: any;
  filteredProductCodes: string[] = [];
  showCodeDropdown = false;
  typedCode = '';
  activeCodeIndex = -1;

  @ViewChild('codeInput', { static: false }) codeInputRef!: ElementRef;

  getProductCodes() {
    this.stockGeneralService.getPackagingProductCodes().subscribe((response: any) => {
      const generalCodes = Array.isArray(response?.data)
        ? response.data.map((p: any) => p.unique_code_sku)
        : [];

      this.productCodeList = [...generalCodes];
      console.log("Product Codes from General Details:", this.productCodeList);
    });
  }

  onCodeInputChange(event: Event) {
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
      this.getProductCodes();
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
    this.packagingForm.get('product_code')?.setValue(code);
    this.filteredProductCodes = [];
    this.showCodeDropdown = false;

    this.patchProductCodeRelatedDataWithGeneralDetails(code);
  }

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
      this.selectProductCode(selectedCode);
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

  purchasePrice:any;
  patchProductCodeRelatedDataWithGeneralDetails(code: string) {
    this.rawMetalService.searchByUniqueCodeSku(code).subscribe({
      next: (response) => {
        const dataArray = response.data || [];
        console.log('Data length:', dataArray.length);
        if (dataArray.length >= 1) {
          const productData = dataArray[0];
          if (productData) {
            console.log('Product Data:', productData);
            this.packagingForm.patchValue({
              material_categories: productData.category?.name,
              size: productData.size || '',
              material_name: productData.product_name,
              per_piece : productData.per_piece_price,
              // quantity: productData.quantity,
              total_price: '',
            });
            // Call getQuantities AFTER patching initial product data
            this.getQuantities(productData.id);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching product data:', err);
      }
    });
  }

  getQuantities(id:any){
    forkJoin([
      this.stockPriceService.getPriceDataByProductId(id),
      this.packagingService.getPackagingListByProductId(id)
    ]).subscribe({
      next: ([priceRes, packagingRes]) => {
        if (priceRes.data && priceRes.data.length > 0) {
          const existingValue = this.packagingForm.get('per_piece')?.value;
          if (!existingValue) {
            this.purchasePrice = priceRes.data[0].purchase_price;
            this.packagingForm.patchValue({
              per_piece: this.purchasePrice || '',
            });
          }
        }

        // Process packaging details data
        if (packagingRes?.data?.length) {
          this.packagingDetailforQty = packagingRes.data.filter((p: any) => p.product_id === id);
          if(this.packagingDetailforQty.length > 0){
            this.showQuantityListFieldForDevide = true;
            this.packagingForm.get('add_name')?.enable();
          } else {
            const perPieceControl = this.packagingForm.get('per_piece');
            const quantityControl = this.packagingForm.get('quantity');
            this.showQuantityListFieldForDevide = false;
            this.packagingForm.get('add_name')?.disable();
            if (!perPieceControl?.value && !quantityControl?.value) {
              this.packagingForm.patchValue({
                total_price: '',
              });
            }
          }
          console.log("related data length",this.packagingDetailforQty.length);
          this.packagingDataListQty = this.packagingDetailforQty.map((item: any) => ({
            quantity: item.quantity,
            artical_name: item.material_name
          }));
        } else {
          this.packagingDetailforQty = [];
          this.showQuantityListFieldForDevide = false;
          this.packagingForm.get('add_name')?.disable();
          if (!this.packagingForm.get('per_piece')?.value) {
            this.packagingForm.patchValue({
              quantity: '',
              total_price: '',
            });
          }
        }

        this.focusFirstEmptyField();
      },
      error: (err: any) => {
        console.error('Error fetching combined product and packaging data:', err);
        this.focusFirstEmptyField();
      }
    });
  }
}
