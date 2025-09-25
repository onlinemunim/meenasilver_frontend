import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  Renderer2,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { NotificationService } from '../../../../Services/notification.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { HttpParams } from '@angular/common/http';
import { StockInService } from '../../../../Services/Stock_Transactions/Stock_in/stock-in.service';
import { LogarithmicScale } from 'chart.js';

@Component({
  selector: 'app-metal',
  templateUrl: './metal.component.html',
  styleUrls: ['./metal.component.css'],
  standalone: true,

  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    CustomSelectComponent,
    CommonModule,
    RouterLink
  ],
})
export class MetalComponent implements OnInit, OnDestroy {
  rawMetalEntryForm!: FormGroup;
  allMetals: string[] = ['Silver', 'Gold', 'Platinum'];
  filteredMetals: string[] = [];
  typedMetal: string = '';
  showMetalDropdown: boolean = false;
  submitbutton: boolean = true;
  updatebutton: boolean = false;
  iseditMode = false;
  serialCounter: number = 1;

  imagePreviews: (string | ArrayBuffer | null)[] = [null, null];
  fileUploadError: (string | null)[] = [null, null];
  selectedFiles: (File | null)[] = [null, null];

  calculatedQuantity: number | null = null;
  calculatedPerPieceSilverPrice: string | null = null;
  calculatedPerPieceLabour: string | null = null;
  calculatedPerPieceShipping: string | null = null;
  calculatedTotalPerPiecePrice: string | null = null;

  @ViewChild('metalInput') metalInput!: ElementRef;
  @ViewChild('metalDropdown') metalDropdown!: ElementRef;

  private formValueChangeSubscription: Subscription | null = null;
  private firmSelectionSubscription: Subscription | null = null;
  private clickListener: (() => void) | null = null;
  prefixData: any;
  metalPrefix: any;
  rawmetaldata: any;
  rawmetalId: any;
  rawMetalProductId: any;
  currentFirmId: number | null = null;
  selectedFirm: any;

  sizeType: string[] = ['MM', 'CM', 'DM'];
  selectedSizeType: string = 'MM';
  rawMetalDataList: any;
  stockInList: any;

  constructor(
    private fb: FormBuilder,
    private rawMetalService: RawMetalService,
    private notificationService: NotificationService,
    private renderer: Renderer2,
    private customizeService: CustomizeService,
    private activateroute: ActivatedRoute,
    private firmSelectionService: FirmSelectionService,
    private stockInService:StockInService
  ) {}

  ngOnInit(): void {
    this.rawMetalProductId = this.activateroute.snapshot.params['id'];
    this.iseditMode = !!this.rawMetalProductId;

    this.firmSelectionSubscription = this.firmSelectionService.selectedFirmName$
      .subscribe((firm: any) => {
        this.currentFirmId = firm?.id;

        this.initializeForm();
         this.getProductCodes();

        if (this.iseditMode) {
          setTimeout(() => {
            this.patchData();
          }, 0);
        } else {
          this.getMetalPrefix();
        }
        // this.getRawMetalList();
        this.getStockInEntries();
      });

    this.rawMetalEntryForm.get('st_metal_type')?.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.typedMetal = value || '';
        this.filterMetals(this.typedMetal);
      });

    this.clickListener = this.renderer.listen('document', 'click', (event: Event) => {
      if (this.metalInput && this.metalDropdown) {
        const target = event.target as HTMLElement;
        if (
          !this.metalInput.nativeElement.contains(target) &&
          !this.metalDropdown.nativeElement.contains(target)
        ) {
          this.showMetalDropdown = false;
        }
      }
    });
  }

  private initializeForm(): void {
    if (this.rawMetalEntryForm) {
      this.formValueChangeSubscription?.unsubscribe();
    }

    this.rawMetalEntryForm = this.fb.group({
      st_item_code: ['', [Validators.required, Validators.maxLength(255)]],
      st_product_code_type: 'raw_metal',
      st_metal_type: ['Silver', Validators.required],
      st_item_name: ['', Validators.required],
      st_item_size: ['', [Validators.required]],
      st_size_type: [this.selectedSizeType],
      st_quantity: [{ value: '', disabled: true }],
      st_total_wt: ['', [Validators.required, Validators.min(0.001)]],
      st_subunit: ['', [Validators.required, Validators.min(0.001)]],
      st_metal_rate: ['', [Validators.required, Validators.min(0.01)]],
      st_per_gm_labour: ['', [Validators.required, Validators.min(0.01)]],
      st_per_gm_shipping: ['', [Validators.required, Validators.min(0.01)]],
      st_purity: '100',
      st_item_category: '',

      st_firm_id: [this.currentFirmId, Validators.required],
    });

    this.rawMetalEntryForm
      .get('st_item_name')
      ?.valueChanges.subscribe((nameValue: string) => {
        this.rawMetalEntryForm.get('st_item_category')?.setValue(nameValue);
      });

    this.setupLiveCalculations();
  }

  ngOnDestroy(): void {
    if (this.formValueChangeSubscription) {
      this.formValueChangeSubscription.unsubscribe();
    }
    if (this.clickListener) {
      this.clickListener();
    }
    if (this.firmSelectionSubscription) {
      this.firmSelectionSubscription.unsubscribe();
    }
  }

  getControl(name: string): AbstractControl {
    return this.rawMetalEntryForm.controls[name];
  }

  filterMetals(value: string): void {
    if (value) {
      this.filteredMetals = this.allMetals.filter((metal) =>
        metal.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      this.filteredMetals = this.allMetals;
    }
    this.showMetalDropdown = this.filteredMetals.length > 0;
  }

  onMetalInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.rawMetalEntryForm.get('st_metal_type')?.setValue(input.value);
  }

  onFocusMetal(): void {
    this.showMetalDropdown = true;
    this.filterMetals(this.typedMetal);
  }

  onBlurMetalType() {
    this.showMetalDropdown = false;
  }

  selectFilteredMetal(metal: string): void {
    this.rawMetalEntryForm.get('st_metal_type')?.setValue(metal);
    this.typedMetal = metal;
    this.showMetalDropdown = false;
  }

  onSizeTypeChange(value: string) {
    this.selectedSizeType = value;
    this.rawMetalEntryForm.get('st_size_type')?.setValue(value);
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
        return;
      }

      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
      ];
      if (!allowedTypes.includes(file.type)) {
        this.fileUploadError[index] = 'Only JPG, PNG, WEBP images are allowed.';
        this.imagePreviews[index] = null;
        this.selectedFiles[index] = null;
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

  prodCategory: string[] = ['Silver', 'Gold', 'Platinum'];
  selectedProdCategory: string = '';

  setupLiveCalculations(): void {
    this.formValueChangeSubscription = this.rawMetalEntryForm.valueChanges
      .pipe(
        debounceTime(50),
        distinctUntilChanged((prev, curr) => {
          const relevantKeys = [
            'st_total_wt',
            'st_subunit',
            'st_metal_rate',
            'st_per_gm_labour',
            'st_per_gm_shipping',
          ];
          for (const key of relevantKeys) {
            if (prev[key] !== curr[key]) {
              return false;
            }
          }
          return true;
        })
      )
      .subscribe((values) => {
        this.performCalculations();
      });
  }

  performCalculations(): void {
    const totalWeight = parseFloat(
      this.rawMetalEntryForm.get('st_total_wt')?.value
    );
    const perPieceWeight = parseFloat(
      this.rawMetalEntryForm.get('st_subunit')?.value
    );
    const silverRate = parseFloat(
      this.rawMetalEntryForm.get('st_metal_rate')?.value
    );
    const perGramLabour = parseFloat(
      this.rawMetalEntryForm.get('st_per_gm_labour')?.value
    );
    const perGramShipping = parseFloat(
      this.rawMetalEntryForm.get('st_per_gm_shipping')?.value
    );

    if (
      !isNaN(totalWeight) &&
      totalWeight > 0 &&
      !isNaN(perPieceWeight) &&
      perPieceWeight > 0
    ) {
      this.calculatedQuantity = Math.floor(totalWeight / perPieceWeight);
      this.rawMetalEntryForm
        .get('st_quantity')
        ?.setValue(this.calculatedQuantity, { emitEvent: false });
    } else {
      this.calculatedQuantity = null;
      this.rawMetalEntryForm
        .get('st_quantity')
        ?.setValue('', { emitEvent: false });
    }

    if (
      !isNaN(perPieceWeight) &&
      perPieceWeight > 0 &&
      !isNaN(silverRate) &&
      silverRate > 0
    ) {
      this.calculatedPerPieceSilverPrice = (
        perPieceWeight * silverRate
      ).toFixed(2);
    } else {
      this.calculatedPerPieceSilverPrice = null;
    }

    if (
      !isNaN(perPieceWeight) &&
      perPieceWeight > 0 &&
      !isNaN(perGramLabour) &&
      perGramLabour >= 0
    ) {
      this.calculatedPerPieceLabour = (perPieceWeight * perGramLabour).toFixed(
        2
      );
    } else {
      this.calculatedPerPieceLabour = null;
    }

    if (
      !isNaN(perPieceWeight) &&
      perPieceWeight > 0 &&
      !isNaN(perGramShipping) &&
      perGramShipping >= 0
    ) {
      this.calculatedPerPieceShipping = (
        perPieceWeight * perGramShipping
      ).toFixed(2);
    } else {
      this.calculatedPerPieceShipping = null;
    }

    if (
      this.calculatedPerPieceSilverPrice !== null &&
      this.calculatedPerPieceLabour !== null &&
      this.calculatedPerPieceShipping !== null
    ) {
      const total =
        parseFloat(this.calculatedPerPieceSilverPrice) +
        parseFloat(this.calculatedPerPieceLabour) +
        parseFloat(this.calculatedPerPieceShipping);
      this.calculatedTotalPerPiecePrice = total.toFixed(2);
    } else {
      this.calculatedTotalPerPiecePrice = null;
    }
  }

  // getRawMetalList() {
  //   this.rawMetalService.getRawMetalEntries().subscribe({
  //     next: (res: any) => {
  //       this.rawMetalDataList = (res.data || [])
  //         .filter((item: any) => item.st_product_code_type === 'raw_metal')
  //         .sort((a: any, b: any) =>
  //           new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  //         )
  //         .slice(0, 5);
  //     },
  //     error: (err) => {
  //       console.error('Error fetching raw metal list:', err);
  //       this.notificationService.showError('Failed to load raw metal list.', 'Error');
  //     }
  //   });
  // }

  getStockInEntries() {
    let params = new HttpParams().set('firm_id', String(this.currentFirmId ?? ''));
    this.stockInService.getStockInEntries(params).subscribe(
      (response: any) => {

        if (response?.data?.length) {
          this.stockInList = response.data
            .filter((item: any) => item.stin_product_code_type === 'raw_metal')
            .sort((a: any, b: any) => {
              const dateA = new Date(a.stin_entry_date).getTime();
              const dateB = new Date(b.stin_entry_date).getTime();

              return dateB - dateA;
            });
        } else {
          this.stockInList = [];
        }
      },
      (error: any) => {
        this.notificationService.showError(
          'Failed to fetch stock in entries.',
          'Error'
        );
        this.stockInList = [];
      }
    );
  }

  onSubmit(): void {
    if (this.rawMetalEntryForm.valid) {
      const formData = new FormData();

      this.rawMetalEntryForm.enable({ emitEvent: false });

      const formValue = this.rawMetalEntryForm.getRawValue();

      formData.append('st_item_code', formValue.st_item_code);
      formData.append('st_metal_type', formValue.st_metal_type);
      formData.append('st_item_name', formValue.st_item_name);
      formData.append('st_item_size', formValue.st_item_size);
      formData.append('st_size_type', formValue.st_size_type);
      formData.append('st_total_wt', formValue.st_total_wt);
      formData.append('st_subunit', formValue.st_subunit);
      formData.append('st_metal_rate', formValue.st_metal_rate);
      formData.append('st_per_gm_labour', formValue.st_per_gm_labour);
      formData.append('st_per_gm_shipping', formValue.st_per_gm_shipping);
      formData.append('st_firm_id', formValue.st_firm_id);
      formData.append('st_product_code_type', formValue.st_product_code_type);
      formData.append('st_purity', '100');
      formData.append('st_item_category', formValue.st_item_name);

      if (this.calculatedQuantity !== null) {
        formData.append('st_quantity', this.calculatedQuantity.toString());
      }
      if (this.calculatedPerPieceSilverPrice !== null) {
        formData.append('st_unit_price', this.calculatedPerPieceSilverPrice);
      }
      if (this.calculatedPerPieceLabour !== null) {
        formData.append('st_per_piece_labour', this.calculatedPerPieceLabour);
      }
      if (this.calculatedPerPieceShipping !== null) {
        formData.append(
          'st_per_piece_shipping',
          this.calculatedPerPieceShipping
        );
      }
      if (this.calculatedTotalPerPiecePrice !== null) {
        formData.append('st_sub_unit_price', this.calculatedTotalPerPiecePrice);
      }

      if (this.selectedFiles[0]) {
        formData.append(
          'st_image1',
          this.selectedFiles[0],
          this.selectedFiles[0].name
        );
      }
      if (this.selectedFiles[1]) {
        formData.append(
          'st_image2',
          this.selectedFiles[1],
          this.selectedFiles[1].name
        );
      }

      this.rawMetalService.createRawMetalEntry(formData).subscribe({
        next: (response) => {
          this.notificationService.showSuccess(
            'Raw Metal Entry added successfully!',
            'Success'
          );
          // this.getRawMetalList();
          this.getStockInEntries();
          this.clearForm();
          this.getMetalPrefix();
          this.getProductCodes();
        },
        error: (error) => {
          console.error('Error adding Raw Metal Entry:', error);
          this.notificationService.showError(
            'Failed to add Raw Metal Entry. Please try again.',
            'Error'
          );
        },
      });
    } else {
      this.rawMetalEntryForm.markAllAsTouched();
      this.notificationService.showError(
        'Form is invalid. Please check the fields.',
        'Validation Error'
      );
    }
    this.rawMetalEntryForm.get('st_quantity')?.disable({ emitEvent: false });
  }

  clearForm(): void {
    this.rawMetalEntryForm.reset({
      st_item_code: this.generatedMetalCode,
      st_purity: '100',
      st_metal_type: 'Silver',
      st_product_code_type: 'raw_metal',
      st_firm_id: this.currentFirmId,
    });
    this.typedMetal = '';
    this.selectedSizeType = 'MM';
    this.rawMetalEntryForm
      .get('st_size_type')
      ?.setValue(this.selectedSizeType, { emitEvent: false });
    this.filteredMetals = [];
    this.showMetalDropdown = false;
    this.imagePreviews = [null, null];
    this.fileUploadError = [null, null];
    this.selectedFiles = [null, null];

    this.calculatedQuantity = null;
    this.calculatedPerPieceSilverPrice = null;
    this.calculatedPerPieceLabour = null;
    this.calculatedPerPieceShipping = null;
    this.calculatedTotalPerPiecePrice = null;


    this.getMetalPrefix();

    Object.keys(this.rawMetalEntryForm.controls).forEach((key) => {
      this.rawMetalEntryForm.controls[key].setErrors(null);
      this.rawMetalEntryForm.controls[key].markAsPristine();
      this.rawMetalEntryForm.controls[key].markAsUntouched();
    });

    this.rawMetalEntryForm.get('st_quantity')?.disable({ emitEvent: false });
  }



  clearMetalCode() {
    if (this.rawMetalEntryForm.get('st_item_code')) {
      this.rawMetalEntryForm.patchValue({ st_item_code: '' });
    }
  }


  generatedCodeWithPrefix(): string {
    const prefix = this.metalPrefix ?? '';
    const serial = String(this.serialCounter).padStart(5, '0');
    this.serialCounter++;
    return prefix + serial;
  }

  generatedMetalCode: string | undefined;
  patchMetalCode(code: string) {
    this.generatedMetalCode = code;
    if (this.rawMetalEntryForm.get('st_item_code')) {
      this.rawMetalEntryForm.patchValue({ st_item_code: code });
    } else {
      console.warn('st_item_code form control not found');
    }
  }


  getMetalPrefix() {
    this.customizeService.getCustomizeSettings().subscribe(
      (response: any) => {
        if (response?.data && response.data.length > 0) {
          this.prefixData = response.data[response.data.length - 1];
          this.metalPrefix = this.prefixData?.customize_metal_prefix;

          if (this.metalPrefix) {
            this.customizeService.getNextMetalCode(this.metalPrefix).subscribe({
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
            console.warn('Metal prefix missing in customize settings.');
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

  getNextMetalCode(prefix: string) {
    this.customizeService.getNextMetalCode(prefix).subscribe({
      next: (res: any) => {
        if (res?.code) {
          this.patchMetalCode(res.code);
        } else {
          this.clearStoneCode();
          console.warn('No code returned from backend.');
        }
      },
      error: (err) => {
        this.clearStoneCode();
        console.error('Error getting next stone code:', err);
      },
    });
  }


  clearStoneCode() {
    if (this.rawMetalEntryForm.get('st_item_code')) {
      this.rawMetalEntryForm.patchValue({ st_item_code: '' });
    }
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

  patchData() {
    if (!this.rawMetalProductId) {
      console.warn('rawMetalProductId is not available for patching.');
      return;
    }

    this.rawMetalService
      .getRawMetalEntryById(this.rawMetalProductId)
      .subscribe({
        next: (response: any) => {
          this.rawmetaldata = response.data;
          if (!this.rawMetalEntryForm || !this.rawmetaldata) {
            console.warn('Form not initialized or no data to patch.');
            return;
          }

          this.submitbutton = false;
          this.updatebutton = true;
          this.rawmetalId = this.rawmetaldata.id;
          this.rawMetalEntryForm.enable({ emitEvent: false });
          const patchValues = {
            ...this.rawmetaldata,
            st_total_wt: parseFloat(this.rawmetaldata.st_total_wt || 0),
            st_subunit: parseFloat(this.rawmetaldata.st_subunit || 0),
            st_metal_rate: parseFloat(this.rawmetaldata.st_metal_rate || 0),
            st_per_gm_labour: parseFloat(
              this.rawmetaldata.st_per_gm_labour || 0
            ),
            st_per_gm_shipping: parseFloat(
              this.rawmetaldata.st_per_gm_shipping || 0
            ),
            st_quantity: parseFloat(this.rawmetaldata.st_quantity || 0),
            st_unit_price: parseFloat(this.rawmetaldata.st_unit_price || 0),
            st_per_piece_labour: parseFloat(
              this.rawmetaldata.st_per_piece_labour || 0
            ),
            st_per_piece_shipping: parseFloat(
              this.rawmetaldata.st_per_piece_shipping || 0
            ),
            st_sub_unit_price: parseFloat(
              this.rawmetaldata.st_sub_unit_price || 0
            ),
          };

          this.rawMetalEntryForm.patchValue(patchValues, { emitEvent: false });
          this.selectedSizeType = this.rawmetaldata.st_size_type || 'MM';
          this.onSizeTypeChange(this.selectedSizeType);

          this.rawMetalEntryForm
            .get('st_quantity')
            ?.disable({ emitEvent: false });
          this.performCalculations();
        },
        error: (error) => {
          console.error('Error fetching raw metal entry by ID:', error);
          this.notificationService.showError(
            'Failed to load metal data for editing.',
            'Error'
          );
        },
      });
  }

  editMetal() {
    this.rawMetalEntryForm.enable({ emitEvent: false });

    if (this.rawMetalEntryForm.valid) {
      const formData = new FormData();
      const formValue = this.rawMetalEntryForm.getRawValue();

      formData.append('st_item_code', formValue.st_item_code);
      formData.append('st_metal_type', formValue.st_metal_type);
      formData.append('st_item_name', formValue.st_item_name);
      formData.append('st_item_size', formValue.st_item_size);
      formData.append('st_size_type', formValue.st_size_type);
      formData.append('st_total_wt', formValue.st_total_wt);
      formData.append('st_subunit', formValue.st_subunit);
      formData.append('st_metal_rate', formValue.st_metal_rate);
      formData.append('st_per_gm_labour', formValue.st_per_gm_labour);
      formData.append('st_per_gm_shipping', formValue.st_per_gm_shipping);
      formData.append('st_firm_id', formValue.st_firm_id);
      formData.append('st_product_code_type', formValue.st_product_code_type);
      formData.append('st_purity', '100');
      formData.append('st_item_category', formValue.st_item_name);


      if (this.calculatedQuantity !== null) {
        formData.append('st_quantity', this.calculatedQuantity.toString());
      }
      if (this.calculatedPerPieceSilverPrice !== null) {
        formData.append('st_unit_price', this.calculatedPerPieceSilverPrice);
      }
      if (this.calculatedPerPieceLabour !== null) {
        formData.append('st_per_piece_labour', this.calculatedPerPieceLabour);
      }
      if (this.calculatedPerPieceShipping !== null) {
        formData.append(
          'st_per_piece_shipping',
          this.calculatedPerPieceShipping
        );
      }
      if (this.calculatedTotalPerPiecePrice !== null) {
        formData.append('st_sub_unit_price', this.calculatedTotalPerPiecePrice);
      }

      if (this.selectedFiles[0]) {
        formData.append(
          'st_image1',
          this.selectedFiles[0],
          this.selectedFiles[0].name
        );
      }
      if (this.selectedFiles[1]) {
        formData.append(
          'st_image2',
          this.selectedFiles[1],
          this.selectedFiles[1].name
        );
      }

      this.rawMetalService
        .updateRawMetalEntry(this.rawMetalProductId, formData)
        .subscribe({
          next: (response: any) => {
            this.notificationService.showSuccess(
              'Raw Metal data updated successfully',
              'Success'
            );
            this.patchData();
          },
          error: (error) => {
            console.error('Error updating Raw Metal Entry:', error);
            this.notificationService.showError(
              'Failed to update Raw Metal Entry. Please try again.',
              'Error'
            );
          },
        });
    } else {
      this.rawMetalEntryForm.markAllAsTouched();
      this.notificationService.showError(
        'Form is invalid. Please check the fields.',
        'Validation Error'
      );
    }
    this.rawMetalEntryForm.get('st_quantity')?.disable({ emitEvent: false });
  }

  //This function is for patch already preset data related code on product code input change....created by vishal ambhore
  productCodeRelatedData: any;

  onProductCodeChange(event: Event) {
    const code = (event.target as HTMLInputElement).value;

    if (!code) {
      this.rawMetalEntryForm.reset(
        {
          st_purity: '100',
          st_metal_type: 'Silver',
          st_product_code_type: 'raw_metal',
          st_firm_id: this.currentFirmId,
          st_item_code: '',
        },
        { emitEvent: false }
      );
      this.selectedSizeType = 'MM';
      this.rawMetalEntryForm.get('st_quantity')?.disable({ emitEvent: false });
      this.getMetalPrefix();
      return;
    }

    this.rawMetalService
      .get_Metal_Data_By_Product_Code_And_Product_Code_Type(code)
      .subscribe({
        next: (response: any) => {
          if (
            response?.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            const data = response.data[0];

            this.rawMetalEntryForm.enable({ emitEvent: false });

            this.rawMetalEntryForm.patchValue(
              {
                st_metal_type: data.st_metal_type || '',
                st_item_name: data.st_item_name || '',
                st_item_size: data.st_item_size || '',
                st_size_type: data.st_size_type || '',
                st_purity: '100',
                st_product_code_type: 'raw_metal',
                st_firm_id: this.currentFirmId,
                st_total_wt: parseFloat(data.st_total_wt || 0),
                st_subunit: parseFloat(data.st_subunit || 0),
                st_metal_rate: parseFloat(data.st_metal_rate || 0),
                st_per_gm_labour: parseFloat(data.st_per_gm_labour || 0),
                st_per_gm_shipping: parseFloat(data.st_per_gm_shipping || 0),
                st_item_category: data.st_item_name || '',
              },
              { emitEvent: false }
            );

            this.selectedSizeType = data.st_size_type || 'MM';
            this.onSizeTypeChange(this.selectedSizeType);


            this.rawMetalEntryForm
              .get('st_quantity')
              ?.disable({ emitEvent: false });
            this.performCalculations();
          } else {
            const st_item_code_value =
              this.rawMetalEntryForm.get('st_item_code')?.value;
            this.rawMetalEntryForm.reset(
              {
                st_purity: '100',
                st_metal_type: 'Silver',
                st_product_code_type: 'raw_metal',
                st_firm_id: this.currentFirmId,
                st_item_code: st_item_code_value,
              },
              { emitEvent: false }
            );
            this.selectedSizeType = 'MM';
            this.rawMetalEntryForm
              .get('st_quantity')
              ?.disable({ emitEvent: false });
          }
        },
        error: (err) => {
          console.error('API error:', err);
          this.notificationService.showError(
            'Error fetching product data.',
            'Error'
          );
          const st_item_code_value =
            this.rawMetalEntryForm.get('st_item_code')?.value;
          this.rawMetalEntryForm.reset(
            {
              st_purity: '100',
              st_metal_type: 'Silver',
              st_product_code_type: 'raw_metal',
              st_firm_id: this.currentFirmId,
              st_item_code: st_item_code_value,
            },
            { emitEvent: false }
          );
          this.selectedSizeType = 'MM';
          this.rawMetalEntryForm
            .get('st_quantity')
            ?.disable({ emitEvent: false });
        },
      });
  }

  rawMetalProductCodes: any;
  rawStoneProductCodes: any;
  generalProductCodes: any;
  private allGeneralProducts: any[] = [];
  allProductCodes: { code: string; name: string }[] = [];
  filteredProductCodes: { code: string; name: string }[] = [];

  showDropdown = false;
  activeCodeIndex = -1;

  getProductCodes() {
    let params = new HttpParams().set('firm_id', String(this.currentFirmId ?? '')).set('st_code_type','raw_metal');
    this.rawMetalService.getStockData(params).subscribe(
      (rawMetal: any) => {

        this.allProductCodes =
          rawMetal?.data?.map((item: any) => ({
            code: item.st_item_code,
            name: item.st_item_name,
          })) || [];
        this.filteredProductCodes = [...this.allProductCodes];
      },
      (error: any) => {
        console.error('Error fetching raw metal product codes:', error);
        this.notificationService.showError(
          'Failed to load raw metal product codes.',
          'Error'
        );
      }
    );
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
      this.rawMetalEntryForm.patchValue(
        {
          st_item_name: '',
          st_item_size: '',
          st_quantity: '',
          st_metal_type: 'Silver',
          st_purity: '100',
          st_product_code_type: 'raw_metal',
          st_size_type: '',
          st_total_wt: '',
          st_subunit: '',
          st_metal_rate: '',
          st_per_gm_labour: '',
          st_per_gm_shipping: '',
          st_item_category: '',
        },
        { emitEvent: false }
      );
      this.selectedSizeType = 'MM';
      this.rawMetalEntryForm.get('st_quantity')?.disable({ emitEvent: false });
    } else {
      this.filteredProductCodes = this.allProductCodes.filter(
        (item) =>
          item.code.toLowerCase().includes(value.toLowerCase()) ||
          item.name.toLowerCase().includes(value.toLowerCase())
      );
    }
  }


  onSelectProductCodeForNewInput(selectedItem: { code: string; name: string }) {
    this.rawMetalEntryForm.get('st_item_code')?.setValue(selectedItem.code);
    this.showDropdown = false;
    this.activeCodeIndex = -1;

    this.rawMetalService
      .get_Metal_Data_By_Product_Code_And_Product_Code_Type(selectedItem.code)
      .subscribe({
        next: (response: any) => {
          if (
            response?.data &&
            Array.isArray(response.data) &&
            response.data.length > 0
          ) {
            const data = response.data[0];
            this.rawMetalEntryForm.enable({ emitEvent: false });

            this.rawMetalEntryForm.patchValue(
              {
                st_metal_type: data.st_metal_type || '',
                st_item_name: data.st_item_name || '',
                st_item_size: data.st_item_size || '',
                st_size_type: data.st_size_type || '',
                // st_quantity: data.st_quantity || '',
                st_purity: '100',
                st_product_code_type: data.st_product_code_type || 'raw_metal',
                st_firm_id: this.currentFirmId,
                // st_total_wt: parseFloat(data.st_total_wt || 0),
                st_subunit: parseFloat(data.st_subunit || 0),
                st_metal_rate: parseFloat(data.st_metal_rate || 0),
                st_per_gm_labour: parseFloat(data.st_per_gm_labour || 0),
                st_per_gm_shipping: parseFloat(data.st_per_gm_shipping || 0),
                st_item_category: data.st_item_name || '',
              },
              { emitEvent: false }
            );

            this.selectedSizeType = data.st_size_type || 'MM';
            this.onSizeTypeChange(this.selectedSizeType);

            this.rawMetalEntryForm
              .get('st_quantity')
              ?.disable({ emitEvent: false });
            this.performCalculations();
          } else {
            this.patchProductCodeRelatedDataWithGeneralDetailsForNewInput(
              selectedItem.code
            );
          }
        },
        error: (err: any) => {
          console.error('API error fetching raw metal data:', err);
          this.notificationService.showError(
            'Error fetching product data for code.',
            'Error'
          );
          this.patchProductCodeRelatedDataWithGeneralDetailsForNewInput(
            selectedItem.code
          );
        },
      });
  }
  patchProductCodeRelatedDataWithGeneralDetailsForNewInput(code: string) {
    const productData = this.allGeneralProducts.find(
      (item: any) => item.unique_code_sku === code
    );

    if (productData) {
      this.rawMetalEntryForm.patchValue({
        st_item_name: productData.product_name || '',
        st_metal_type: '',
        st_item_size: productData.product_size || '',
        st_size_type: '',
        st_quantity: productData.quantity || '',
        st_purity: '100',
        st_product_code_type: productData.product_type || 'general',
      });
      this.selectedSizeType = 'MM';
    } else {
      console.warn(
        `Product code '${code}' not found in any product list for new input.`
      );
      const currentCode = this.rawMetalEntryForm.get('st_item_code')?.value;
      this.rawMetalEntryForm.reset(
        {
          st_purity: '100',
          st_metal_type: 'Silver',
          st_product_code_type: 'raw_metal',
          st_firm_id: this.currentFirmId,
          st_item_code: currentCode,
        },
        { emitEvent: false }
      );
      this.selectedSizeType = 'MM';
      this.rawMetalEntryForm.get('st_quantity')?.disable({ emitEvent: false });
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
      const selectedItem = this.filteredProductCodes[this.activeCodeIndex];
      this.onSelectProductCodeForNewInput(selectedItem);
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
