import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { StockService } from '../../../../Services/Stock/stock.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { NotificationService } from '../../../../Services/notification.service';

@Component({
  selector: 'app-packaging-stack-form',
  imports: [NgIf,NgFor, ReactiveFormsModule, CommonModule],
  templateUrl: './packaging-stack-form.component.html',
  styleUrl: './packaging-stack-form.component.css',
  standalone: true
})
export class PackagingStackFormComponent implements OnInit {
  packagingDataList: any;
  packagingList: any[] = [];
  deleteWastageDetail(arg0: any) {
    throw new Error('Method not implemented.');
  }

  submitbutton: boolean = true;
  updatebutton: boolean = false;
  packagingStackForm!: FormGroup;
  selectedFirm!: number;
  packagingProductNames: any;
  packagingProductCodes: { st_item_code: string; st_item_name: string }[] = [];
  filteredProductCodes: { st_item_code: string; st_item_name: string }[] = [];
  showDropdown = false;
  activeIndex: number = -1;
  singlePackagingData: any;
  packagingeditId: any;
  editmode: boolean = false;
  minorPackagingList: any;
  finalValueButto: boolean = false;

  @ViewChildren('itemRef') itemElements!: QueryList<ElementRef>;
  wastageData: any;

  constructor(
    private fb: FormBuilder,
    private stockService: StockService,
    private firmSelectionService: FirmSelectionService,
    private notificationService: NotificationService,
    private activateroute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.packagingeditId = this.activateroute.snapshot.params['id'];
    this.editmode = !!this.packagingeditId;

    this.getPackagingProductCodes();
    this.getNamesAndCostList();
    this.getMinorNamesAndCostList();
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
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  initForm() {
    this.packagingStackForm = this.fb.group({
      st_packaging_stack_name: [''],
      st_item_name: [''],
      st_item_category: [''],
      st_type_stack: ['major'],
      st_unit_price: [''],
      st_no_of_primary_minor: [''],
      st_major_cost_on_minor: [''],
      st_final_valuation: [''],
      st_packaging_form_type: ['create_packaging_stack'],
      st_purity: ['100'],
      st_metal_type: ['Packaging Stack'],
      st_product_code_type: ['Packaging Stack'],
      st_item_code: [''],
      st_firm_id: this.selectedFirm,
      st_minor_packaging_items: this.fb.array([]),
    });

    this.packagingStackForm.get('st_unit_price')?.valueChanges.subscribe(() => this.calculateFinalValuation());
    this.packagingStackForm.get('st_no_of_primary_minor')?.valueChanges.subscribe(() => this.calculateFinalValuation());

    this.packagingItems.valueChanges.subscribe(() => this.calculateFinalValuation());

    this.packagingStackForm.get('st_packaging_stack_name')?.valueChanges.subscribe((name: string) => {
      if (name) {
        const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.packagingStackForm.patchValue({
          st_item_code: `${name}${randomCode}`
        });
      } else {
        this.packagingStackForm.patchValue({
          st_item_code: ''
        });
      }
    });

    this.packagingStackForm.get('st_item_name')?.valueChanges.subscribe((val) => {
      if (val && typeof val === 'object') {
        this.packagingStackForm.patchValue({
          st_item_category: val.st_item_name || '',
        });
      } else {
        this.packagingStackForm.patchValue({
          st_item_category: val || '',
        });
      }
    });
  }

  calculateFinalValuation(): void {
    const majorItemCost = parseFloat(this.packagingStackForm.get('st_unit_price')?.value) || 0;
    const noOfPrimaryMinor = parseFloat(this.packagingStackForm.get('st_no_of_primary_minor')?.value) || 0;
    let majorCostOnMinor = 0;

    if (majorItemCost > 0 && noOfPrimaryMinor > 0) {
      majorCostOnMinor = majorItemCost / noOfPrimaryMinor;
    }

    this.packagingStackForm.get('st_major_cost_on_minor')?.setValue(majorCostOnMinor.toFixed(2), { emitEvent: false });

    let minorItemsTotalCost = 0;
    this.packagingItems.controls.forEach(control => {
      const itemPrice = parseFloat(control.get('st_unit_price')?.value) || 0;
      minorItemsTotalCost += itemPrice;
    });

    const finalValue = majorCostOnMinor + minorItemsTotalCost;
    this.packagingStackForm.get('st_final_valuation')?.setValue(finalValue.toFixed(2), { emitEvent: false });
  }

  get packagingItems(): FormArray {
    return this.packagingStackForm.get('st_minor_packaging_items') as FormArray;
  }

  addPackagingItem(): void {
    this.packagingItems.push(
      this.fb.group({
        st_item_name: [''],
        st_unit_price: ['']
      })
    );
    this.finalValueButto = true;
  }

  onPackagingItemSelectFromArray(index: number): void {
    const formArray = this.packagingStackForm.get('st_minor_packaging_items') as FormArray;
    const itemGroup = formArray.at(index) as FormGroup;

    const selectedItem = itemGroup.get('st_item_name')?.value;

    if (selectedItem && selectedItem.st_item_cost) {
      itemGroup.patchValue({
        st_unit_price: selectedItem.st_item_cost
      });
    } else {
      itemGroup.patchValue({
        st_unit_price: null
      });
    }
  }

  updateUnitPriceFromSupplier(): void {
    const code = parseFloat(this.packagingStackForm.get('st_unit_price')?.value) || 0;
    const NoOfPrimaryMinor = parseFloat(this.packagingStackForm.get('st_no_of_primary_minor')?.value) || 0;

    if (code > 0 && NoOfPrimaryMinor > 0) {
      const unitPrice = code / NoOfPrimaryMinor;
      this.packagingStackForm.get('st_major_cost_on_minor')?.setValue(unitPrice.toFixed(2), { emitEvent: false });
    }
  }

  getPackagingList() {
    this.stockService.getStockEntries().subscribe({
      next: (res: any) => {
        this.packagingDataList = (res.data || [])
          .filter((item: any) => item.st_product_code_type === 'Packaging Stack')
          .map((item: any) => ({
            ...item,
            st_minor_packaging_items: item.st_minor_packaging_items
              ? JSON.parse(item.st_minor_packaging_items)
              : [],
          }))
          .sort((a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          )
          .slice(0, 5);

      },
      error: (err) => {
        console.error('Error fetching packaging list:', err);
        this.notificationService.showError('Failed to load packaging stack list.', 'Error');
      }
    });
  }

  getNamesAndCostList(): void {
    this.stockService.getMajorOrMinorDataByType('major').subscribe({
      next: (res: { data: any[] }) => {
        this.packagingList = (res?.data ?? []).map(item => ({
          st_item_cost: item.st_unit_price,
          st_item_name: item.st_item_name
        }));
      },
      error: (err) => {
        console.error('Error fetching packaging product names:', err);
        this.notificationService.showError('Failed to load packaging product names.', 'Error');
      }
    });
  }

  getMinorNamesAndCostList(): void {
    this.stockService.getMajorOrMinorDataByType('minor').subscribe({
      next: (res: { data: any[] }) => {
        this.minorPackagingList = (res?.data ?? []).map(item => ({
          st_item_cost: item.st_unit_price,
          st_item_name: item.st_item_name
        }));
      },
      error: (err) => {
        console.error('Error fetching packaging product names:', err);
        this.notificationService.showError('Failed to load packaging product names.', 'Error');
      }
    });
  }

  onPackagingItemSelect(): void {
    const selectedItem = this.packagingStackForm.get('st_item_name')?.value;
    if (selectedItem && selectedItem.st_item_cost) {
      this.packagingStackForm.patchValue({
        st_unit_price: selectedItem.st_item_cost
      });
    } else {
      this.packagingStackForm.patchValue({
        st_unit_price: null
      });
    }
  }

  patchData(): void {
    if (!this.editmode || !this.packagingeditId) return;

    this.stockService.getStockEntryById(this.packagingeditId).subscribe({
      next: (response: any) => {
        const packagingData = response.data;
        if (!this.packagingStackForm || !packagingData) {
          this.notificationService.showError('No data found for this ID.', 'Error');
          return;
        }

        this.submitbutton = false;
        this.updatebutton = true;

        this.packagingStackForm.patchValue({
          st_item_code: packagingData.st_item_code ?? '',
          st_type_stack: packagingData.st_type_stack ?? '',
          st_item_name: this.packagingList.find(i => i.st_item_name === packagingData.st_item_name) ?? '',
          st_unit_price: parseFloat(packagingData.st_unit_price || 0),
          st_no_of_primary_minor: packagingData.st_no_of_primary_minor ?? '',
          st_purity: parseFloat(packagingData.st_purity || 100),
          st_metal_type: packagingData.st_metal_type ?? 'Packaging Stack',
          st_product_code_type: packagingData.st_product_code_type ?? 'Packaging Stack',
        }, { emitEvent: false });
      },
      error: (error) => {
        console.error('Error fetching packaging entry by ID:', error);
        this.notificationService.showError('Failed to load data for editing.', 'Error');
      }
    });
  }


  onSubmit() {
    const rawFormData = { ...this.packagingStackForm.value };

    if (typeof rawFormData.st_item_name === 'object' && rawFormData.st_item_name?.st_item_name) {
      rawFormData.st_item_name = rawFormData.st_item_name.st_item_name;
    }

    rawFormData.st_minor_packaging_items = (this.packagingItems.value || []).map((item: any) => {
      if (item.st_item_name && typeof item.st_item_name === 'object') {
        return {
          st_item_name: item.st_item_name.st_item_name,
          st_item_cost: item.st_item_name.st_item_cost,
        };
      }
      return {
        st_item_name: item.st_item_name,
        st_item_cost: item.st_unit_price,
      };
    });

    this.stockService.createStockEntry(rawFormData).subscribe({
      next: () => {
        this.notificationService.showSuccess('Packaging Stack data stored successfully!', 'Success');
        this.getPackagingList();
        this.getPackagingProductCodes();
        this.onClear();
      },
      error: (err) => {
        console.error('Error from server:', err);
        this.notificationService.showError('Failed to store Packaging Stack data.', 'Error');
      }
    });
  }

  onClear() {
    this.packagingStackForm.reset({
      st_type_stack: 'major',
      st_purity: '100',
      st_metal_type: 'Packaging Stack',
      st_product_code_type: 'Packaging Stack',
      st_packaging_form_type: 'create_packaging_stack',
      st_firm_id: this.selectedFirm,
    });
  }

  getPackagingProductCodes(): void {
    this.stockService.getPackagingProductCode().subscribe((res: any) => {
      this.packagingProductCodes = Array.isArray(res?.data) ? res.data : [];
      this.filteredProductCodes = [...this.packagingProductCodes];
    });
  }

  onProductCodeInput(): void {
    const input = this.packagingStackForm.get('st_item_code')?.value?.toLowerCase() || '';

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
    this.packagingStackForm.get('st_item_code')?.setValue(code);
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
        const typedCode = this.packagingStackForm.get('st_item_code')?.value;
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

      if (this.singlePackagingData) {
        this.packagingStackForm.patchValue({
          st_item_name: this.singlePackagingData.st_item_name ?? '',
          st_type_stack: this.singlePackagingData.st_type_stack ?? '',
          st_unit_price: this.singlePackagingData.st_unit_price ?? '',
          st_no_of_primary_minor: this.singlePackagingData.st_no_of_primary_minor ?? '',
        });
      }
    });
  }

  editpackage() {}

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
