import { NotificationService } from './../../../../Services/notification.service';
import { NgFor, NgIf } from '@angular/common';
import { RateListGeneratorService } from './../../../../Services/Rate_List_Generator/rate-list-generator.service';
import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { RouterLink } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { Router } from '@angular/router';
import { CategoryService } from '../../../../Services/Category/category.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-rate-list-generator',
  standalone: true,
  imports: [CustomSelectComponent, NgFor, ReactiveFormsModule, NgIf],
  templateUrl: './rate-list-generator.component.html',
  styleUrl: './rate-list-generator.component.css',
})
export class RateListGeneratorComponent implements OnInit {
  rateListGeneratorForm!: FormGroup;
  firmSelectionSubscription: any;
  currentFirmId: any;
  RateListGeneratorList: any;
  editButton: boolean = false;
  addbutton: boolean = true;
  rateId: any;
  categories: any[] = [];

  //
  rateList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private firmSelectionService: FirmSelectionService,
    private rateListGeneratorService: RateListGeneratorService,
    private NotificationService: NotificationService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.firmSelectionSubscription = this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
        this.currentFirmId = firm?.id;
        this.initRateListGeneratorForm();
        // this.getRateList();
        this.getCategories();
        this.rateListGeneratorForm
          .get('rlg_customer_type')
          ?.valueChanges.subscribe((value) => {
            if (value) {
              this.selectedCustomer = value;
              this.rateListGeneratorForm
                .get('rlg_customer_type')
                ?.disable({ emitEvent: false });
            }
          });
      });
  }

  private isRangeOverlap(
    category: string,
    min: number,
    max: number,
    above: boolean,
    below: boolean,
    code: string
  ): boolean {
    const existing = this.RateListGeneratorList.filter(
      (x: any) => x.rlg_product_category === category
    );

    for (const item of existing) {
      // ✅ Skip check if it's a different code
      if (item.rlg_code !== code) continue;

      const itemMin = +item.rlg_min_weight_range;
      const itemMax = +item.rlg_max_weight_range;
      const itemAbove = item.rlg_above === 'Yes';
      const itemBelow = item.rlg_below === 'Yes';

      if (above && itemAbove) {
        return true;
      }
      if (below && itemBelow) {
        return true;
      }
      if (!above && !below && !itemAbove && !itemBelow) {
        if (
          (min >= itemMin && min <= itemMax) ||
          (max >= itemMin && max <= itemMax) ||
          (itemMin >= min && itemMin <= max)
        ) {
          return true;
        }
      }
    }

    return false;
  }
  getCategories() {
    forkJoin({
      rateList: this.rateListGeneratorService.getRateList(),
      categories: this.categoryService.getCategories(),
    }).subscribe(({ rateList, categories }: any) => {
      this.RateListGeneratorList = rateList.data.slice(-5).reverse();
      console.log('Recent Categoriews', this.categories);

      // store full categories for later lookup
      this.categories = categories.data;

      // store only names for dropdown
      this.prodCategory = this.categories
        .filter((item: any) => item.mrp && item.mrp !== '')
        .map((item: any) => item.name);
    });
  }

  // onCategoryChange(categoryName: string) {
  //   const selectedCategory = this.categories.find(c => c.name === categoryName);
  //   console.log('Selected Category:', selectedCategory);

  //   if (selectedCategory) {
  //     // Patch the reactive form
  //     this.rateListGeneratorForm.patchValue({
  //       rlg_unit: selectedCategory.unit
  //     });

  //     // Update the custom select — make sure it's the exact value in options
  //     this.selectedUnit = this.unitType.find(u => u === selectedCategory.unit) || selectedCategory.unit;
  //     console.log('Selected Unit for dropdown:', this.selectedUnit);
  //   }
  // }
  onCategoryChange(categoryName: string) {
    const selectedCategory = this.categories.find(c => c.name === categoryName);
    console.log('Selected Category:', selectedCategory);

    if (selectedCategory) {
      // Patch the reactive form
      this.rateListGeneratorForm.patchValue({
        rlg_unit: selectedCategory.unit
      });

      // Update the custom select — make sure it's the exact value in options
      this.selectedUnit = this.unitType.find(u => u === selectedCategory.unit) || selectedCategory.unit;
      console.log('Selected Unit for dropdown:', this.selectedUnit);
    }
  }




  prodCategory: string[] = [];
  selectedProdCategory: string = '';

  initRateListGeneratorForm() {
    this.rateListGeneratorForm = this.fb.group({
      rlg_customer_type: [''],
      rlg_department: [''],
      rlg_unit: [''],
      rlg_code: [''],
      rlg_weight_range: [''],
      rlg_min_weight_range: [''],
      rlg_max_weight_range: [''],
      rlg_per_gm_labour: [''],
      rlg_discount: [''],
      rlg_purity: [''],
      rlg_firm_id: this.currentFirmId,
      rlg_product_type: [''],
      rlg_product_category: [''],
      rlg_making_charges: [''],
      rlg_above: [''],
      rlg_below:['']
    });

    this.rateListGeneratorForm
      .get('rlg_customer_type')
      ?.enable({ emitEvent: false });

    this.rateListGeneratorForm
      .get('rlg_customer_type')
      ?.valueChanges.subscribe((value) => {
        if (value) {
          this.selectedCustomer = value;
          this.rateListGeneratorForm
            .get('rlg_customer_type')
            ?.disable({ emitEvent: false });
        }
      });
  }

  onSubmit() {
    if (this.rateListGeneratorForm.invalid) return;

    const formData = this.rateListGeneratorForm.getRawValue();
    formData.rlg_above = formData.rlg_above ? 'Yes' : 'No';
    formData.rlg_below = formData.rlg_below ? 'Yes' : 'No';

    const min = +formData.rlg_min_weight_range;
    const max = +formData.rlg_max_weight_range;
    const above = formData.rlg_above === 'Yes';
    const below = formData.rlg_below === 'Yes';
    const category = formData.rlg_product_category;
    const code = formData.rlg_code;

    if (this.isRangeOverlap(category, min, max, above, below, code)) {
      this.NotificationService.showError(
        `Range already exists for code "${code}" in category "${category}"`,
        'Validation Error'
      );
      return;
    }

    this.rateListGeneratorService.createRateList(formData).subscribe({
      next: (res: any) => {
        this.NotificationService.showSuccess(
          'Rate List added successfully!',
          'Success'
        );

        this.rateId = res.data.rlg_id;
        this.getCategories();
        this.clearForm();
      },
      error: () => {
        this.NotificationService.showError('Something went wrong', 'Error');
      },
    });
  }


  onDelete(rlg_id: any) {
    this.rateListGeneratorService.deleteRateList(rlg_id).subscribe(
      (res: any) => {
        this.NotificationService.showSuccess(
          'Stone Deleted Successfully',
          'Success'
        );
      },
      (error: any) => {
        this.NotificationService.showError('Error deleting stone', 'Error');
      }
    );
  }

  patchRateListGenerator(rlg_id: any) {
    this.rateListGeneratorService
      .getRateListById(rlg_id)
      .subscribe((res: any) => {
        const data = res.data;
        this.rateId = data.rlg_id;
        this.rateListGeneratorForm.patchValue(data);
        this.editButton = true;
        this.addbutton = false;
      });
  }

  updateForm() {
    this.rateListGeneratorService
      .updateRateList(this.rateId, this.rateListGeneratorForm.value)
      .subscribe(
        (res: any) => {
          this.NotificationService.showSuccess(
            'Rate List Updated Successfully',
            'Success'
          );
          // this.getRateList();
          this.clearForm();
        },
        (error: any) => {
          this.NotificationService.showError(
            'Error updating rate list',
            'Error'
          );
        }
      );
  }

  clearForm() {
    this.rateListGeneratorForm.reset({
      rlg_firm_id: this.currentFirmId,
      rlg_customer_type:
        this.rateListGeneratorForm.get('rlg_customer_type')?.value,
    });
    this.editButton = false;
    this.addbutton = true;
    this.NotificationService.showInfo('Form cleared', 'Info');
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

  // for Customer Type
  customerType: string[] = ['Wholesale', 'Jeweller', 'Direct'];
  selectedCustomer: string = '';

  // for Product Type
  productType: string[] = ['Assembly', 'Master'];
  selectedProduct: string = '';

  // for Product Category
  productCategory: string[] = [''];
  selectedCategory: string = '';

  // for Product Category
  unitType: string[] = ['By Gram', 'By MRP', 'By Silver value'];
  selectedUnit: string = '';

  // for Weight Range
  wtRange: string[] = ['Custom', 'From Current', 'All'];
  selectedRange: string = '';

  onSaveListClick() {
    this.rateListGeneratorForm.get('rlg_customer_type')?.enable();
    this.router.navigate(['/generated-rate-list']);
  }

  openPrintView(ids: string) {
    window.open(`/rate-list/print/${ids}`, '_blank');
  }
}
