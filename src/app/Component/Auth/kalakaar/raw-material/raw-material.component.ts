import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../Services/notification.service';
import { OrderCreationService } from '../../../../Services/order-creation.service';
import { HttpParams } from '@angular/common/http';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-raw-material',
  imports: [NgIf, NgFor, NgClass],
  templateUrl: './raw-material.component.html',
  styleUrl: './raw-material.component.css',
})
export class RawMaterialComponent implements OnInit {
  orders: any;
  isLoading: boolean = true;

  constructor(
    private notificationService: NotificationService,
    private orderservice: OrderCreationService
  ) {}

  ngOnInit(): void {
    this.getOrderList(localStorage.getItem('supplierId'));
  }

  getOrderList(supplierId: any) {
    if (!supplierId) {
      this.notificationService.showError(
        'Supplier ID not found in localStorage',
        'Error'
      );
      return;
    }

    let params = new HttpParams().set('supplier_id', supplierId);

    this.orderservice.getOrders(params).subscribe({
      next: (res: any) => {
        this.orders = res.data.map((order: any) => {
          return {
            ...order,
            ordc_metal_details: order.ordc_metal_details
              ? Array.isArray(order.ordc_metal_details)
                ? order.ordc_metal_details
                : [order.ordc_metal_details]
              : [],
            ordc_stone_details: order.ordc_stone_details
              ? Array.isArray(order.ordc_stone_details)
                ? order.ordc_stone_details
                : [order.ordc_stone_details]
              : [],
          };
        });

        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching orders:', err);
        this.notificationService.showError('Failed to fetch orders', 'Error');
      },
    });
  }
}
