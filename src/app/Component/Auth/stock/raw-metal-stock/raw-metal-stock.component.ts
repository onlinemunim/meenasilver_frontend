import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { StoneFormComponent } from '../stone-form/stone-form.component'; // Adjust if needed

@Component({
  selector: 'app-raw-metal-stock',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomSelectComponent,
    StoneFormComponent,
  ],
  templateUrl: './raw-metal-stock.component.html',
  styleUrls: ['./raw-metal-stock.component.css']
})
export class RawMetalStockComponent {
  // Dropdown options
  metalTypes = ['Copper', 'Aluminium', 'Steel'];
  itemCategory = ['Category 1', 'Category 2', 'Category 3'];
  unitTypes = ['Kg', 'Gram', 'Ton'];
  firmTypes = ['Firm A', 'Firm B'];
  brandSeller = ['Brand X', 'Brand Y'];

  // Selected dropdown values
  selectedMetal = '';
  selectedItem = '';
  selectedUnit = '';
  selectedFirm = '';
  selectedBrandseller = '';

  // Reactive Form
  form: FormGroup;

  // Placeholder text for date inputs
  placeholders = {
    billDate: '',
    mfdDate: '',
  };

  // Toggle visibility of Stone Form
  isFormVisible = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      billDate: [''],
      mfdDate: [''],
      featurestatus: [false],
      // add other controls if needed
    });
  }

  toggleForm(): void {
    this.isFormVisible = !this.isFormVisible;
  }

  onDelete(): void {
    console.log('Delete action triggered');
    // Implement deletion logic here if required
  }

  // Show placeholder on focus
  setPlaceholder(field: 'billDate' | 'mfdDate'): void {
    this.placeholders[field] = 'DD/MM/YYYY';
  }

  // Clear placeholder on blur
  clearPlaceholder(field: 'billDate' | 'mfdDate'): void {
    this.placeholders[field] = '';
  }


  formatDateInput(value: string): string {
    // Remove all non-digit characters
    let digits = value.replace(/\D/g, '');

    if (digits.length === 0) return '';

    if (digits.length <= 2) {
      // Add slash after 2 digits
      return digits.length === 2 ? digits + '/' : digits;
    } else if (digits.length <= 4) {
      // Format as DD/MM
      return digits.slice(0, 2) + '/' + digits.slice(2) + (digits.length === 4 ? '/' : '');
    } else {
      // Format as DD/MM/YYYY (max 8 digits)
      return digits.slice(0, 2) + '/' + digits.slice(2, 4) + '/' + digits.slice(4, 8);
    }
  }

  autofillDate(dayString: string): string {
    // When only day is entered, autofill month and year from today
    const day = dayString.padStart(2, '0');
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  }

  onDateInput(field: 'mfdDate' | 'billDate', event: Event) {
    const input = event.target as HTMLInputElement;
    const val = input.value;

    const formatted = this.formatDateInput(val);

    if (formatted !== val) {
      input.value = formatted;


    }
  }

}
