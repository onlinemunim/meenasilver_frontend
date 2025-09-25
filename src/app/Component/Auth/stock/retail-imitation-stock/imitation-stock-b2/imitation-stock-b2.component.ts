import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CustomSelectComponent } from '../../../../Core/custom-select/custom-select.component';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { StoneFormComponent } from '../../stone-form/stone-form.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FirmService } from '../../../../../Services/firm.service';
import { StockService } from '../../../../../Services/Stock/stock.service';
import { NotificationService } from '../../../../../Services/notification.service';

@Component({
  selector: 'app-imitation-stock-b2',
  standalone: true,
  imports: [
    CustomSelectComponent,
    RouterLink,
    RouterLinkActive,
    NgIf,
    StoneFormComponent,
    ReactiveFormsModule,
    NgFor,
  ],
  templateUrl: './imitation-stock-b2.component.html',
  styleUrls: ['./imitation-stock-b2.component.css']
})
export class ImitationStockB2Component implements OnInit, AfterViewInit {
  fineStockForm!: FormGroup;
  stockOptionsForm!: FormGroup;

  @ViewChild('prodCodeInput') prodCodeInput!: ElementRef<HTMLInputElement>;

  firmTypes: string[] = [];
  selectedFirm = '';

  brandSeller: string[] = [''];
  selectedBrandseller = '';

  metalTypes: string[] = ['Gold'];
  selectedMetal = '';

  itemCategory: string[] = ['Ring'];
  selectedItem = '';

  sizeRange: string[] = ['10 X 10'];
  selectedSize = '';

  genderType: string[] = ['Male', 'Female', 'Kids', 'Unisex'];
  selectedGender = '';

  colorTypes: string[] = ['White'];
  selectedColor = '';

  unitTypes: string[] = ['GM', 'KG', 'MG'];
  selectedUnit = '';
  selectedNetWeightUnit = '';
  selectedMakingChargesUnit = '';
  selectedLabChargesUnit = '';
  selectedHMChargesUnit = '';
  selectedOtherChargesUnit = '';

  placeholders = {
    mfdDate: '',
    billDate: '',
    expDate: '', // ✅ added
  };

  stoneForms: any[] = [];
  isFormVisible = false;

  constructor(
    private fb: FormBuilder,
    private firmService: FirmService,
    private stockService: StockService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initFineStockForm();
    this.initStockOptionsForm();
    this.loadFirmList();
    initFlowbite();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.prodCodeInput.nativeElement.focus();
    }, 0);
  }

  private initFineStockForm() {
    this.fineStockForm = this.fb.group({
      st_item_code: [''],
      st_bill_date: [''],
      st_mfd_date: [''],
      st_exp_date: [''], // ✅ added
      st_firm_id: [''],
      st_brand_seller_name: [''],
      st_metal_type: ['Silver'],
      st_metal_rate: [''],
      st_pre_id: [''],
      st_post_id: [''],
      st_hsn_code: [''],
      st_item_category: [''],
      st_item_name: [''],
      st_huid: [''],
      st_item_model_no: [''],
      st_item_size: [''],
      st_item_length: [''],
      st_color: [''],
      st_barcode: [''],
      st_rfid_number: [''],
      st_quantity: [''],
      st_gs_weight: [''],
      st_less_weight: [''],
      st_pkt_weight: [''],
      st_net_weight: [''],
      st_net_weight_type: ['GM'],
      st_purity: [''],
      st_wastage: [''],
      st_cust_weight: [''],
      st_cust_wastage_weight: [''],
      st_final_purity: [''],
      st_tag_weight: [''],
      st_counter_name: [''],
      st_location: [''],
      st_fine_weight: [''],
      st_final_fine_weight: [''],
      st_making_charges: [''],
      st_making_charges_type: ['GM'],
      st_valuation: [''],
      st_lab_charges: [''],
      st_lab_charges_type: ['GM'],
      st_total_lab_charges: [''],
      st_hm_charges: [''],
      st_hm_charges_type: ['GM'],
      st_total_hm_charges: [''],
      st_other_charges: [''],
      st_other_charges_type: ['GM'],
      st_total_other_charges: [''],
      st_tax: [''],
      st_total_tax: [''],
      st_total_taxable_amt: [''],
      st_bis_hallmark: [''],
      st_add_details: [''],
      st_add_ecom: [''],
      st_fix_mrp: [''],
      st_final_valuation: [''],
      st_type: ['retail'],
    });

    this.fineStockForm.get('st_pre_id')?.valueChanges.subscribe(() => this.updateItemCode());
    this.fineStockForm.get('st_post_id')?.valueChanges.subscribe(() => this.updateItemCode());

    ['st_bill_date', 'st_mfd_date', 'st_exp_date'].forEach(field => {
      this.fineStockForm.get(field)?.valueChanges.subscribe(val => {
        if (typeof val === 'string') {
          const formatted = this.formatDateInput(val);
          if (formatted !== val) {
            this.fineStockForm.get(field)?.setValue(formatted, { emitEvent: false });
          }
        }
      });
    });
  }

  private initStockOptionsForm(): void {
    this.stockOptionsForm = this.fb.group({
      st_bis_hallmark: [false],
      st_add_details: [false],
      st_add_ecom: [false],
      st_fix_mrp: [false],
    });
  }

  private loadFirmList() {
    this.firmService.getFirms().subscribe((res: any) => {
      this.firmTypes = res.data.map((firm: any) => firm.name);
    });
  }

  private updateItemCode(): void {
    const pre = this.fineStockForm.get('st_pre_id')?.value || '';
    const post = this.fineStockForm.get('st_post_id')?.value || '';
    this.fineStockForm.get('st_item_code')?.setValue(pre + post, { emitEvent: false });
  }

  formatDateInput(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 2) return digits.length === 2 ? digits + '/' : digits;
    if (digits.length <= 4) return digits.slice(0, 2) + '/' + digits.slice(2) + (digits.length === 4 ? '/' : '');
    return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8);
  }

  autofillDate(dayString: string): string {
    const day = dayString.padStart(2, '0');
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  setPlaceholder(field: 'mfdDate' | 'billDate' | 'expDate') {
    this.placeholders[field] = 'DD/MM/YYYY';
  }

  clearPlaceholder(field: 'mfdDate' | 'billDate' | 'expDate') {
    this.placeholders[field] = '';
  }

  onDateInput(field: 'mfdDate' | 'billDate' | 'expDate', event: Event) {
    const input = event.target as HTMLInputElement;
    const val = input.value;
    const formatted = this.formatDateInput(val);

    if (formatted !== val) {
      input.value = formatted;

      const controlMap: Record<string, string> = {
        mfdDate: 'st_mfd_date',
        billDate: 'st_bill_date',
        expDate: 'st_exp_date',
      };

      const controlName = controlMap[field];
      this.fineStockForm.get(controlName)?.setValue(formatted, { emitEvent: false });
    }
  }

  onSubmit() {
    ['st_bill_date', 'st_mfd_date', 'st_exp_date'].forEach(field => {
      const val = this.fineStockForm.get(field)?.value;
      if (val && typeof val === 'string' && val.length === 2 && /^\d{2}$/.test(val)) {
        this.fineStockForm.get(field)?.setValue(this.autofillDate(val));
      }
    });

    ['st_bill_date', 'st_mfd_date', 'st_exp_date'].forEach(field => {
      const val = this.fineStockForm.get(field)?.value;
      if (val instanceof Date) {
        this.fineStockForm.get(field)?.setValue(val.toISOString().split('T')[0]);
      } else if (typeof val === 'string' && val.includes('T')) {
        this.fineStockForm.get(field)?.setValue(val.split('T')[0]);
      }
    });

    this.stockService.createStockEntry(this.fineStockForm.value).subscribe(
      () => {
        this.notificationService.showSuccess('Fine Stock Entry Created Successfully!', 'Success');
        this.clearForm();
      },
      () => {
        this.notificationService.showError('Failed to create Fine Stock Entry', 'Error');
      }
    );
  }

  clearForm() {
    this.fineStockForm.reset({
      st_metal_type: 'Silver',
      st_net_weight_type: 'GM',
      st_lab_charges_type: 'GM',
      st_hm_charges_type: 'GM',
      st_other_charges_type: 'GM',
      st_making_charges_type: 'GM',
      st_type: 'retail',
    });
  }

  addStoneForm() {
    this.stoneForms.push({});
  }

  removeStoneForm(index: number) {
    this.stoneForms.splice(index, 1);
  }

  toggleForm() {
    this.isFormVisible = !this.isFormVisible;
  }
}
