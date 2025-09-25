import { NotificationService } from './../../../../Services/notification.service';
import { NgFor } from '@angular/common';
import { UserSupplierService } from '../../../../Services/User/Supplier/user-supplier.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

interface Document {
  doc_user_img?: string;
  doc_pan_front_img?: string;
  doc_pan_back_img?: string;
  doc_aadhar_front_img?: string;
  doc_aadhar_back_img?: string;
  [key: string]: any;
}

interface Supplier {
  id: number;
  name: string;
  mobilenumber: string;
  gstnumber: string;
  email: string;
  doc_user_img?: string;
  documents?: Document[];
}

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [NgFor,RouterLink],
  templateUrl: './supplier-list.component.html',
  styleUrl: './supplier-list.component.css'
})
export class SupplierListComponent implements OnInit {

  userSupplierList: Supplier[] = [];

  constructor(private userSupplierService: UserSupplierService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getUserSuppliers();
  }

  getUserSuppliers() {
    const queryParams = new HttpParams();
    this.userSupplierService.getUserSupplier(queryParams).subscribe({
      next: (res: any) => {
        this.userSupplierList = res.data;
        console.log('User Supplier List:', this.userSupplierList);
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
}
