import { NgFor } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserSupplierService } from '../../../../Services/User/Supplier/user-supplier.service';
import { NotificationService } from '../../../../Services/notification.service';

@Component({
  selector: 'app-kalakar-list',
  imports: [RouterLink,NgFor],
  templateUrl: './kalakar-list.component.html',
  styleUrl: './kalakar-list.component.css'
})
export class KalakarListComponent implements OnInit {

  userSupplierList: any[] = [];

  constructor(private userSupplierService: UserSupplierService,private notificationService: NotificationService) { }

  private router = inject(Router)

  ngOnInit(): void {
    this.getUserSuppliers();
  }

  getUserSuppliers() {
    const queryParams = new HttpParams()
        .append("user_supplier_type[]","Kalakar")
        .append("user_supplier_type[]","Karigar");
    this.userSupplierService.getUserSupplier(queryParams).subscribe({
      next: (res: any) => {
        this.userSupplierList = res.data;

        if (this.userSupplierList.length > 0) {
          localStorage.setItem('supplierId', this.userSupplierList[0].id.toString());
        }
      },
      error: (err: any) => {
        console.error('Error fetching user supplier list:', err);
      }
    });
  }

  onDelete(id: number) {
    this.userSupplierService.deleteUserSupplier(id).subscribe({
      next: (res: any) => {
        console.log('User Supplier Deleted Successfully:');
        this.notificationService.showSuccess(
          'Stone Deleted Successfully',
          'Success'
        );
        this.getUserSuppliers();
      },error: (err: any) => {
        console.error('Error deleting user supplier:', err);
      }
    });
  }

  onKalakaeClick(id: number) {
    if (id) {
          localStorage.setItem('supplierId', id.toString());
          this.router.navigate(['/kalakaar-management/home']);
        }
      }
}
