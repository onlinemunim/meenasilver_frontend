import { ReadyProductService } from './../../../../Services/Ready-Product/ready-product.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule,ReactiveFormsModule,} from '@angular/forms';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { NotificationService } from '../../../../Services/notification.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { TaggingService } from '../../../../Services/Tagging/tagging.service';
import { HttpParams } from '@angular/common/http';
import { CategoryService } from '../../../../Services/Category/category.service';
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service';
import { RateListGeneratorService } from '../../../../Services/Rate_List_Generator/rate-list-generator.service';

@Component({
  selector: 'app-product-tagging',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './product-tagging.component.html',
  styleUrl: './product-tagging.component.css',
})
export class ProductTaggingComponent implements OnInit {
  productTaggingForm!: FormGroup;
  completedProductCodes: any[] = [];
  productTaggingDataList: any;
  selectedFirm: any;
  completeProductData: any;
  data: any[] = [];
  readyProductDataList: any[] = [];
  highlightedIndex = -1;
  rateListCodes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private firmSelectionService: FirmSelectionService,
    private tagginsService: TaggingService,
    private readyProductService: ReadyProductService,
    private categoryService: CategoryService,
    private customizeService: CustomizeService,
    private rateListService: RateListGeneratorService
  ) {}

  ngOnInit(): void {
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      this.selectedFirm = firm?.id;
      this.initForm();
      this.getAndSetBarcode();
    });
    this.fetchRateListCodes();
    this.getReadyProductList();
  }

  initForm() {
    this.productTaggingForm = this.fb.group({
      std_barcode: [''],
      std_item_code: [''],
      std_model_no: [''],
      std_item_category: [''],
      std_stone_type: [''],
      std_item_size: [''],
      std_rate_list_code: [''],
      std_unit_price: [''],
      std_image: [''],
      std_total_wt: [''],
      std_product_type: ['piece-wise'],
      std_firm_id: this.selectedFirm,
    });
  }

  getDataForModelNo(itemCode: any) {
    this.tagginsService.getTaggingsDataOnItemCode(itemCode).subscribe((res: any) => {
      const itemCodeLength = res.data?.length || 0;

      // Patch std_model_no with itemCode + '#' + (length + 1)
      const newModelNo = `${itemCode}-${itemCodeLength + 1}`;
      this.productTaggingForm.patchValue({
        std_model_no: newModelNo
      });
    });
  }


  getReadyProductList() {
    const params = new HttpParams()
      .set('ready_product_type', 'piece-wise') // Fetch only products meant for tagging
      .set('quantity_greater_than', '0'); // Fetch only products that have quantity to tag

    this.readyProductService.getReadyProducts(params).subscribe({
      next: (res: any) => {
        this.readyProductDataList = (res.data || []).sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      },
      error: (err) => {
        this.notificationService.showError(
          'Failed to load ready product list.',
          'Error'
        );
      },
    });
  }

  addProductTaggingData() {
    if (this.productTaggingForm.invalid) {
      this.notificationService.showError('Form is invalid.', 'Error');
      return;
    }

    const payload = this.productTaggingForm.getRawValue();

    this.tagginsService.createStockDetails(payload).subscribe({
      next: (res: any) => {
        this.notificationService.showSuccess('Product Tagged Successfully!', 'Success');

        const updatedItemCode = res.data?.std_item_code;

        this.readyProductService.getReadyProducts(
          new HttpParams()
            .set('ready_product_type', 'piece-wise')
            .set('quantity_greater_than', '0')
        ).subscribe({
          next: (productRes: any) => {
            const updatedList = productRes.data || [];

            this.readyProductDataList = updatedList.sort((a: any, b: any) =>
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            );

            const updatedProduct = updatedList.find(
              (p: any) => p.rproduct_code === updatedItemCode
            );

            if (updatedProduct) {
              this.selectedProduct = updatedProduct;
              this.onStart(updatedProduct);
            }

            this.getAndSetBarcode();
          },
          error: () => {
            this.notificationService.showError(
              'Failed to refresh product list after tagging.',
              'Error'
            );
          }
        });
      },
      error: (error: any) => {
        const errorMessage = error.error?.message || 'Failed to tag product.';
        this.notificationService.showError(errorMessage, 'Error');
      }
    });
  }


  clearForm() {
    this.productTaggingForm.reset({
      std_firm_id: this.selectedFirm,
      std_item_code: '',
      std_barcode: '',
      std_product_type: 'piece-wise',
    });
    this.completeProductData = null;
    this.selectedProduct = null;
    this.getAndSetBarcode();
  }

  getAndSetBarcode() {
    this.customizeService.getCustomizeSettings().subscribe({
      next: (response: any) => {
        if (response?.data?.length > 0) {
          const settings = response.data[response.data.length - 1];
          const barcodePrefix = settings?.customize_barcode_prefix;
          if (barcodePrefix) {
            this.customizeService.getNextBarcode(barcodePrefix).subscribe({
              next: (res: any) => {
                if (res?.code) {
                  this.productTaggingForm.patchValue({ std_barcode: res.code });
                }
              },
            });
          }
        }
      },
    });
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    const target = keyboardEvent.target as HTMLElement;
    const form = target.closest('form');
    if (!form) return;
    const focusableElements = Array.from(
      form.querySelectorAll<HTMLElement>('input, select, textarea, button')
    ).filter(
      (el) =>
        !el.hasAttribute('disabled') &&
        !el.hasAttribute('readonly') &&
        el.tabIndex !== -1 &&
        el.offsetParent !== null
    );
    const currentIndex = focusableElements.indexOf(target);
    if (currentIndex !== -1 && currentIndex + 1 < focusableElements.length) {
      focusableElements[currentIndex + 1].focus();
    }
  }

  mrp: any;
  length: any;
  showWeightField = false;
  selectedProduct: any;

  onStart(metal: any): void {
    this.getDataForModelNo(metal.rproduct_code);

    this.selectedProduct = metal;
    this.categoryService.getMrp(metal.rproduct_categories?.name).subscribe((res: any) => {
      const category = res?.data?.[0];
      const mrpValue = parseFloat(category?.mrp);
      this.mrp = isNaN(mrpValue) ? 0 : Math.round(mrpValue);
      this.showWeightField = !!(metal.rproduct_total_wt && parseFloat(metal.rproduct_total_wt) > 0);
      if (!this.showWeightField) {
        this.productTaggingForm.get('std_unit_price')?.setValue(this.mrp);
      } else {
         this.productTaggingForm.get('std_total_wt')?.reset();
         this.productTaggingForm.get('std_unit_price')?.reset();
      }

      this.tagginsService.getTaggingsDataOnItemCode(metal.rproduct_code).subscribe((tagRes: any) => {
        // this.length = (tagRes.data?.length || 0) + 1;
        this.productTaggingForm.patchValue({
          std_item_code: `${metal.rproduct_code}`,
          std_item_category: metal.rproduct_categories?.name || '',
          std_stone_type: metal.rproduct_stonetype || '',
          std_item_size: metal.rproduct_size || '',
          std_image: metal.rproduct_image || '',
        });
        this.setupWeightWatcher();
      });
    });
  }

  setupWeightWatcher(): void {
    const weightControl = this.productTaggingForm.get('std_total_wt');
    weightControl?.valueChanges.subscribe((weight: string) => {
      const weightValue = parseFloat(weight) || 0;

      if (this.showWeightField) {
        const calculatedMrp = +(weightValue * this.mrp).toFixed(2);
        this.productTaggingForm
          .get('std_unit_price')
          ?.setValue(calculatedMrp, { emitEvent: false });
      }

      if (weightValue > 0 && this.rateListCodes.length > 0) {
        const currentCategory =
          this.productTaggingForm.get('std_item_category')?.value ||
          this.selectedProduct?.rproduct_categories?.name ||
          '';

        const matchedRate = this.rateListCodes.find((rate: any) => {
          const min = rate.rlg_min_weight_range
            ? parseFloat(rate.rlg_min_weight_range)
            : null;
          const max = rate.rlg_max_weight_range
            ? parseFloat(rate.rlg_max_weight_range)
            : null;

          // Case 1: both min & max present
          if (min !== null && max !== null) {
            return weightValue >= min && weightValue <= max &&
                   rate.rlg_product_category?.toLowerCase() === currentCategory?.toLowerCase();
          }

          // Case 2: only min present → check "above"
          if (min !== null && max === null) {
            return rate.rlg_above === 'Yes' &&
                   weightValue >= min &&
                   rate.rlg_product_category?.toLowerCase() === currentCategory?.toLowerCase();
          }

          // Case 3: only max present → check "below"
          if (min === null && max !== null) {
            return rate.rlg_below === 'Yes' &&
                   weightValue <= max &&
                   rate.rlg_product_category?.toLowerCase() === currentCategory?.toLowerCase();
          }

          return false;
        });

        if (matchedRate) {
          this.productTaggingForm.patchValue({
            std_rate_list_code: matchedRate.rlg_code,
          });
          this.showRateDropdown = false;
        } else {
          this.productTaggingForm.patchValue({
            std_rate_list_code: '',
          });
        }
      }
    });
  }

  filteredRateListCodes: any[] = [];
  showRateDropdown = false;

  fetchRateListCodes() {
    this.rateListService.getRateList().subscribe({
      next: (res: any) => {
        const codes = res?.data || [];
        this.rateListCodes = codes;
        this.filteredRateListCodes = [...codes];
      },
      error: (err) => console.error('Rate list fetch error:', err),
    });
  }

  onRateListCodeInputChange(event: any) {
    const input = event.target.value.toLowerCase();
    this.filteredRateListCodes = this.rateListCodes.filter((item) =>
      item.rlg_code?.toLowerCase().includes(input)
    );
    this.showRateDropdown = true;
    this.highlightedIndex = -1;
  }

  selectRateListCode(code: string) {
    this.productTaggingForm.get('std_rate_list_code')?.setValue(code);
    this.filteredRateListCodes = [];
    this.showRateDropdown = false;
    this.highlightedIndex = -1;
  }

  hideDropdownWithDelay() {
    setTimeout(() => {
      this.showRateDropdown = false;
    }, 200);
  }

  onRateListKeydown(event: KeyboardEvent) {
    if (this.showRateDropdown && this.filteredRateListCodes.length > 0) {
      if (event.key === 'ArrowDown') {
        this.highlightedIndex =
          (this.highlightedIndex + 1) % this.filteredRateListCodes.length;
        event.preventDefault();
      } else if (event.key === 'ArrowUp') {
        this.highlightedIndex =
          (this.highlightedIndex - 1 + this.filteredRateListCodes.length) %
          this.filteredRateListCodes.length;
        event.preventDefault();
      } else if (event.key === 'Enter') {
        if (this.highlightedIndex >= 0) {
          const selected = this.filteredRateListCodes[this.highlightedIndex];
          this.selectRateListCode(selected.rlg_code);
          event.preventDefault();
        } else {
          this.focusNext(event);
        }
      } else if (event.key === 'Escape') {
        this.showRateDropdown = false;
      }
    } else if (event.key === 'Enter') {
      this.focusNext(event);
    }
  }
}
