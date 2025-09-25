import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { KalakaarIncomeComponent } from "../kalakaar-income/kalakaar-income.component";
import { OrderHistoryComponent } from '../order-history/order-history.component';
import { ReceivedRawMaterialComponent } from '../received-raw-material/received-raw-material.component';
import { KalakaarDetailsComponent } from '../kalakaar-details/kalakaar-details.component';
import { NotificationService } from '../../../../Services/notification.service';
import { OrderCreationService } from '../../../../Services/order-creation.service';
import { HttpParams } from '@angular/common/http';
import { UserSupplierService } from '../../../../Services/User/Supplier/user-supplier.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-kalakaar-home',
  imports: [ KalakaarIncomeComponent, OrderHistoryComponent, ReceivedRawMaterialComponent, KalakaarDetailsComponent, NgIf],
  templateUrl: './kalakaar-home.component.html',
  styleUrl: './kalakaar-home.component.css'
})
export class KalakaarHomeComponent implements OnInit, OnDestroy {

  ordersData: any[] = [];
  userKalakarData: any[] = [];
  isLoading = true;
  private subscriptions: Subscription = new Subscription();

  constructor(
     private notificationService: NotificationService,
     private orderservice: OrderCreationService,
     private userSupplierService: UserSupplierService,
     private firmSelectionService: FirmSelectionService
  ) {}

  ngOnInit(): void {
    const supplierId = localStorage.getItem('supplierId');
    if (!supplierId) {
      this.notificationService.showError('Supplier ID not found', 'Error');
      this.isLoading = false;
      return;
    }

    this.subscriptions.add(
      this.firmSelectionService.selectedFirmName$.subscribe(firm => {
        if (firm) {
          this.fetchAllData(supplierId, firm.id.toString());
        }
      })
    );

    const currentFirm = this.firmSelectionService.getselectedFirmName();
    if (currentFirm) {
      this.fetchAllData(supplierId, currentFirm.id.toString());
    }
  }

  private fetchAllData(supplierId: string, firmId: any) {

    this.isLoading = true;
    this.ordersData = [];
    this.userKalakarData = [];

    const orders$ = this.orderservice.getOrders(new HttpParams().set('supplier_id', supplierId).set('firm_id', firmId));
    const supplier$ = this.userSupplierService.getUserSupplierById(+supplierId);

    orders$.subscribe({
      next: (res: any) => this.ordersData = res.data,
      error: () => this.notificationService.showError('Failed to fetch orders', 'Error'),
      complete: () => this.checkLoadingDone()
    });

    supplier$.subscribe({
      next: (res: any) => this.userKalakarData = [res.data],
      error: (err: any) => console.error('Error fetching supplier:', err),
      complete: () => this.checkLoadingDone()
    });
  }

  private checkLoadingDone() {
    if (this.ordersData.length || this.userKalakarData.length) {
      this.isLoading = false;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
