import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common'; // Import CommonModule
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule and FormBuilder

@Component({
  selector: 'app-current-orders',
  standalone: true,
  imports: [NgFor, CommonModule, ReactiveFormsModule], // Add CommonModule and ReactiveFormsModule here
  templateUrl: './current-orders.component.html',
  styleUrl: './current-orders.component.css'
})
export class CurrentOrdersComponent implements OnInit {
  @Input() orders: any[] = [];
  @Output() orderUpdated = new EventEmitter<any>();

  showEditPopup: boolean = false;
  editOrderForm!: FormGroup;
  selectedOrderId: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editOrderForm = this.fb.group({
      productCode: [{ value: '', disabled: true }], // Product Code is display-only
      status: ['', Validators.required],
      description: ['']
    });
  }

  openEditPopup(order: any): void {
    this.selectedOrderId = order.id;
    this.editOrderForm.patchValue({
      productCode: order.product_code,
      status: order.status || 'pending', // Default to 'pending' if status is not set
      description: order.description || ''
    });
    this.showEditPopup = true;
  }

  closeEditPopup(): void {
    this.showEditPopup = false;
    this.editOrderForm.reset();
    this.selectedOrderId = null;
  }

  submitEdit(): void {
    if (this.editOrderForm.valid && this.selectedOrderId !== null) {
      const updatedData = {
        orderId: this.selectedOrderId,
        status: this.editOrderForm.get('status')?.value,
        description: this.editOrderForm.get('description')?.value
      };
      this.orderUpdated.emit(updatedData);
      this.closeEditPopup();
    }
  }
}
