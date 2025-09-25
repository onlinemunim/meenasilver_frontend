import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pending-orders',
  standalone: true,
  imports: [CommonModule, NgFor, ReactiveFormsModule],
  templateUrl: './pending-orders.component.html',
  styleUrl: './pending-orders.component.css'
})
export class PendingOrdersComponent implements OnInit {
  @Input() orders: any[] = [];
  @Output() orderUpdated = new EventEmitter<any>();

  showEditPopup: boolean = false;
  editOrderForm!: FormGroup;
  selectedOrderId: number | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.editOrderForm = this.fb.group({
      productCode: [{ value: '', disabled: true }],
      status: ['', Validators.required],
      description: ['']
    });
  }

  openEditPopup(order: any): void {
    this.selectedOrderId = order.id;
    this.editOrderForm.patchValue({
      productCode: order.product_code,
      // If status is 'current' or undefined, treat it as 'pending'
      status: (order.status === 'current' || !order.status) ? 'pending' : order.status,
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
