import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormGroup,FormBuilder } from '@angular/forms';
import { StockService } from '../../../../Services/Stock/stock.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { NotificationService } from '../../../../Services/notification.service';
import { ViewChildren, QueryList, ElementRef } from '@angular/core';

@Component({
  selector: 'app-packaging-form',
  imports: [NgIf,ReactiveFormsModule,NgFor,CommonModule,RouterLink],
  templateUrl: './packaging-form.component.html',
  styleUrl: './packaging-form.component.css'
})
export class PackagingFormComponent implements OnInit{
  packagingDataList: any;
deleteWastageDetail(arg0: any) {
throw new Error('Method not implemented.');
}
  submitbutton: boolean = true;
  updatebutton: boolean = false;
  packagingForm!: FormGroup;
  selectedFirm!:number;
  packagingProductNames: any;
  packagingProductCodes: { st_item_code: string; st_item_name: string }[] = [];
  filteredProductCodes: { st_item_code: string; st_item_name: string }[] = [];
  showDropdown = false;
  activeIndex: number = -1;
  singlePackagingData: any;
  packagingeditId: any;
  editmode: boolean = false;

  @ViewChildren('itemRef') itemElements!: QueryList<ElementRef>;
wastageData: any;


  constructor(private fb: FormBuilder,private stockService:StockService,private firmSelectionService:FirmSelectionService,private notificationService:NotificationService,private activateroute: ActivatedRoute) {}


  ngOnInit(): void {

    this.packagingeditId=this.activateroute.snapshot.params['id'];
    this.editmode = !!this.packagingeditId;
    // this.rawMetalProductId = this.activateroute.snapshot.params['id'];
    // this.iseditMode = !!this.rawMetalProductId;

    this.getPackagingProductCodes();
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
    this.selectedFirm = firm?.id;
    this.initForm();
    this.patchData();
    this.getPackagingList();
    });
  }
  private getFormattedCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2); // getMonth() is zero-based
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  initForm() {
    this.packagingForm = this.fb.group({
      st_type: [''],
      st_item_name: [''],
      st_unit_price: [''],
      st_quantity: [''],
      st_packaging_date: [this.getFormattedCurrentDate()], // CHANGED: Set initial value
      st_supplier_name: [''],
      st_supplier_code: [''],
      st_supplier_bill_no: [''],
      st_final_valuation: [''],
      st_packaging_form_type: 'new_packaging_entry',
      st_purity: ['100'],
      st_metal_type: ['packaging'],
      st_product_code_type: ['packaging'],
      st_item_category: [''],
      st_item_code: ['st_item_name'],
      st_firm_id: this.selectedFirm,
    });

    // this.packagingForm.get('st_item_name')?.valueChanges.subscribe(value => {
    //   this.packagingForm.get('st_item_category')?.setValue(value);
    // });
    this.packagingForm.get('st_item_name')?.valueChanges.subscribe(value => {
      this.packagingForm.patchValue({
        st_item_category: value,
        st_item_code: value
      }, { emitEvent: false });
    });

    this.packagingForm.valueChanges.subscribe(values => {
      const price = parseFloat(values.st_unit_price) || 0;
      const quantity = parseFloat(values.st_quantity) || 0;
      const shipping = parseFloat(values.st_per_piece_shipping) || 0;

      const finalCostPerBox = price * quantity;
      this.packagingForm.get('st_final_valuation')?.setValue(finalCostPerBox.toFixed(2), { emitEvent: false });
    });
  }

getPackagingList() {
  this.stockService.getStockEntries().subscribe({
    next: (res: any) => {
      this.packagingDataList = (res.data || [])
        .filter((item: any) => item.st_product_code_type === 'packaging') // ✅ Filter for packaging type only
        .sort((a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 5);
    },
    error: (err) => {
      console.error('Error fetching packaging list:', err);
      this.notificationService.showError('Failed to load packaging list.', 'Error');
    }
  });
}

patchData(): void {
  if (!this.editmode || !this.packagingeditId) {
    console.warn('Not in edit mode or packagingeditId is not available for patching.');
    return;
  }

  this.stockService.getStockEntryById(this.packagingeditId).subscribe({
    next: (response: any) => {
      const packagingData = response.data;
      console.log("Fetched packaging data:", packagingData);

      if (!this.packagingForm || !packagingData) {
        console.warn('Form not initialized or no data to patch.');
        this.notificationService.showError('No packaging data found for this ID.', 'Error');
        return;
      }
          this.submitbutton = false;
          this.updatebutton = true;

      const patchValues = {
        //st_item_code: packagingData.st_item_code ?? '',
        st_final_valuation: parseFloat(packagingData.st_final_valuation || 0), // Parse to float
        st_type: packagingData.st_type ?? '',
        st_item_name: packagingData.st_item_name ?? '',
        st_unit_price: parseFloat(packagingData.st_unit_price || 0), // Parse to float
        st_quantity: parseFloat(packagingData.st_quantity || 0),     // Parse to float
        st_packaging_date: packagingData.st_packaging_date ?? '',
        st_supplier_name: packagingData.st_supplier_name ?? '',
        st_supplier_code: packagingData.st_supplier_code ?? '',
        st_supplier_bill_no: packagingData.st_supplier_bill_no ?? '',
        st_purity: parseFloat(packagingData.st_purity || 100), // Parse to float
        st_metal_type: packagingData.st_metal_type ?? 'packaging',
        st_product_code_type: packagingData.st_product_code_type ?? 'packaging',
        st_item_category: packagingData.st_item_category ?? '', // This might be set by valueChanges
      };


      this.packagingForm.patchValue(patchValues, { emitEvent: false }); // Use emitEvent: false to prevent infinite loops with valueChanges

    },
    error: (error) => {
      console.error('Error fetching packaging entry by ID:', error);
      this.notificationService.showError(
        'Failed to load packaging data for editing.',
        'Error'
      );
      //this.router.navigate(['/packaging/list']); // Redirect on error
    },
  });
}



    editpackage()
    {


    }
   onSubmit() {

    if (this.packagingForm.get('st_type')?.value === '') {
      this.notificationService.showError('Please select Major or Minor', 'Validation');
      return;
    }

    this.stockService.createStockEntry(this.packagingForm.value).subscribe(
      (res: any) => {
        console.log("Response is---", res);
        this.notificationService.showSuccess('Packaging data stored successfully!', 'Success');
        this.getPackagingList();
        this.getPackagingProductCodes();
        this.onClear();
      },
      (error: any) => {
        this.notificationService.showError('Failed to store packaging data. Please try again.', 'Error');
      }
    );
  }

  onClear(){
    this.packagingForm.reset({
      st_type: 'minor',
      st_purity: '100',
      st_metal_type: 'packaging',
      st_product_code_type: 'packaging',
      st_firm_id: this.selectedFirm,
      st_packaging_form_type: 'new_packaging_entry',
      st_packaging_date: this.getFormattedCurrentDate()
    });
  }

  getPackagingProductCodes(): void {
    this.stockService.getPackagingProductCode().subscribe((res: any) => {
      this.packagingProductCodes = Array.isArray(res?.data) ? res.data : [];
      this.filteredProductCodes = [...this.packagingProductCodes];
    });
  }

  onProductCodeInput(): void {
    const input = this.packagingForm.get('st_item_code')?.value?.toLowerCase() || '';

    this.filteredProductCodes = this.packagingProductCodes.filter(item =>
      item.st_item_code.toLowerCase().includes(input) ||
      item.st_item_name.toLowerCase().includes(input)
    );

    this.activeIndex = -1;
    this.showDropdown = true;

    const exactMatch = this.packagingProductCodes.find(item =>
      item.st_item_code.toLowerCase() === input
    );

    if (exactMatch) {
      this.getDataByProductCode(exactMatch.st_item_code);
    }
  }


  onInputFocus(): void {
    this.filteredProductCodes = [...this.packagingProductCodes];
    this.showDropdown = true;
  }

  selectProductCode(code: string): void {
    this.packagingForm.get('st_item_code')?.setValue(code);
    this.showDropdown = false;
    this.getDataByProductCode(code);
  }

  hideDropdownDelayed(): void {
    setTimeout(() => this.showDropdown = false, 200);
  }

  onKeyDown(event: KeyboardEvent): void {
    const maxIndex = this.filteredProductCodes.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = this.activeIndex < maxIndex ? this.activeIndex + 1 : 0;
      this.scrollToActiveItem();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : maxIndex;
      this.scrollToActiveItem();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (this.activeIndex >= 0) {
        const selected = this.filteredProductCodes[this.activeIndex];
        this.selectProductCode(selected.st_item_code);
      } else {
        const typedCode = this.packagingForm.get('st_item_code')?.value;
        if (typedCode) {
          this.getDataByProductCode(typedCode);
        }
      }
    }
  }

  scrollToActiveItem(): void {
    const itemsArray = this.itemElements.toArray();
    const el = itemsArray[this.activeIndex];
    if (el) {
      el.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }


  getDataByProductCode(code: string): void {
    this.stockService.getSingleDataByProductCode(code).subscribe((res: any) => {
      this.singlePackagingData = res.data[0];
      console.log("data is---", this.singlePackagingData.st_packaging_date);

      if (this.singlePackagingData) {
        this.packagingForm.patchValue({
          st_item_name: this.singlePackagingData.st_item_name ?? '',
          st_type: this.singlePackagingData.st_type ?? '',
          st_supplier_name: this.singlePackagingData.st_supplier_name ?? '',
          st_supplier_code: this.singlePackagingData.st_supplier_code ?? '',
          st_supplier_bill_no: this.singlePackagingData.st_supplier_bill_no ?? '',
          st_unit_price: this.singlePackagingData.st_unit_price ?? '',
          st_quantity: this.singlePackagingData.st_quantity ?? '',
          st_packaging_date: this.singlePackagingData.st_packaging_date ?? '',
        });
        console.log("data patched");

      }
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
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

      const index = focusable.indexOf(target);
      if (index > -1 && index + 1 < focusable.length) {
        focusable[index + 1].focus();
      }
    }
  }
}

