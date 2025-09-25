import { NotificationService } from './../../../../Services/notification.service';
import { Component, OnInit } from '@angular/core';
import { AllOrdersComponent } from '../all-orders/all-orders.component';
import { DeliveredOrdersComponent } from "../delivered-orders/delivered-orders.component";
import { RejectedOrdersComponent } from "../rejected-orders/rejected-orders.component";
import { PendingOrdersComponent } from "../pending-orders/pending-orders.component";
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderCreationService } from '../../../../Services/order-creation.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    AllOrdersComponent,
    DeliveredOrdersComponent,
    RejectedOrdersComponent,
    PendingOrdersComponent,
    NgSwitch, NgSwitchCase, FormsModule, ReactiveFormsModule, NgIf
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  isLoading : boolean = true;
  allOrders: any[] = [];
  deliveredOrders: any[] = [];
  pendingOrders: any[] = [];
  rejectedOrders: any[] = [];

  selectedStatus: string = 'all';

  constructor(
    private orderservice: OrderCreationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getOrderList();
  }

  getOrderList() {
    const supplierId = localStorage.getItem('supplierId');

    if (!supplierId) {
      this.notificationService.showError("Supplier ID not found in localStorage", "Error");
      this.isLoading = false;
      return;
    }

    this.isLoading = true;

    let params = new HttpParams().set("supplier_id", supplierId);

    this.orderservice.getOrders(params).subscribe({
      next: (res: any) => {
        this.orders = res.data.map((order: any) => ({
          ...order,
          status: (order.status === 'current' || !order.status) ? 'pending' : order.status
        }));

        this.filterOrdersByStatus(this.orders);
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error("Error fetching orders:", err);
        this.notificationService.showError("Failed to fetch orders", "Error");
        this.isLoading = false;
      }
    });
  }

  filterOrdersByStatus(allOrders: any[]): void {
    this.allOrders = [...allOrders];
    // Now 'current' status is effectively 'pending' due to the map above
    this.pendingOrders = allOrders.filter(order => order.status === 'pending');
    this.deliveredOrders = allOrders.filter(order => order.status === 'completed');
    this.rejectedOrders = allOrders.filter(order => order.status === 'rejected');
  }

  onOrderUpdated(event: { orderId: number, status: string, description: string }): void {
    console.log("Order updated event received:", event);

    this.isLoading = true;

    this.orderservice.updateOrder(event.orderId, {
      ordc_status: event.status,
      ordc_description: event.description
    }).subscribe({
      next: (res) => {
        this.notificationService.showSuccess("Order updated successfully", "Success");
        this.getOrderList();
        this.isLoading = false;
      },
      error: (err) => {
        this.notificationService.showError("Failed to update order", "Error");
        console.error("Error updating order:", err);
        this.isLoading = false;
      }
    });
  }
}
