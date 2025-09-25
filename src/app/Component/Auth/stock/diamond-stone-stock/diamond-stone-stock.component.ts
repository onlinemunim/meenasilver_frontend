import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { StoneFormComponent } from '../stone-form/stone-form.component';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-diamond-stone-stock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectComponent,
    StoneFormComponent,
  ],
  templateUrl: './diamond-stone-stock.component.html',
  styleUrls: ['./diamond-stone-stock.component.css'],
})
export class DiamondStoneStockComponent implements OnInit {
  form: FormGroup;

  // Dropdown options
  metalTypes: string[] = ['Copper', 'Aluminium', 'Steel'];
  itemCategory: string[] = ['Ring'];
  unitTypes: string[] = ['GM'];
  firmTypes: string[] = ['Firm A', 'Firm B'];
  brandSeller: string[] = ['Brand X', 'Brand Y'];
  genderType: string[] = ['Male', 'Female', 'Kids', 'Unisex'];

  // Selected values
  selectedMetal: string = '';
  selectedItem: string = '';
  selectedUnit: string = '';
  selectedFirm: string = '';
  selectedBrandseller: string = '';
  selectedGender: string = '';

  // Placeholders for date fields
  placeholders = {
    billDate: '',
    mfdDate: '',
  };

  // Stone form logic
  stoneForms: any[] = [];
  isFormVisible = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      billDate: [''],
      mfdDate: [''],
      featurestatus: [false],
      // Add additional controls here if needed
    });
  }

  ngOnInit(): void {
    initFlowbite();
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  onDelete(): void {
    console.log('Delete action triggered');
    // Handle delete logic
  }

  addStoneForm(): void {
    this.stoneForms.push({
      type: '',
      weight: null,
      clarity: '',
    });
  }

  removeStoneForm(index: number): void {
    this.stoneForms.splice(index, 1);
  }

  setPlaceholder(field: 'billDate' | 'mfdDate'): void {
    this.placeholders[field] = 'DD/MM/YYYY';
  }

  clearPlaceholder(field: 'billDate' | 'mfdDate'): void {
    this.placeholders[field] = '';
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

  onDateInput(field: 'mfdDate' | 'billDate', event: Event): void {
    const input = event.target as HTMLInputElement;
    const val = input.value;
    const formatted = this.formatDateInput(val);

    if (formatted !== val) {
      input.value = formatted;
      this.form.get(field)?.setValue(formatted, { emitEvent: false });
    }
  }
}
