import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserCustomerService } from '../../../../Services/User/Customer/user-customer.service';
import { NotificationService } from '../../../../Services/notification.service';
import { HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Document {
  doc_user_img?: string;
  doc_pan_front_img?: string;
  doc_pan_back_img?: string;
  doc_aadhar_front_img?: string;
  doc_aadhar_back_img?: string;
  [key: string]: any;
}

interface Customer {
  id: number;
  name: string;
  mobilenumber: string;
  gstnumber: string;
  email: string;
  doc_user_img?: string;
  documents?: Document[];
}

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [NgFor, RouterLink,FormsModule],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.css'
})
export class CustomerListComponent implements OnInit {

  userCustomerList: Customer[] = [];
  activeTab = 0;
  selectedCustomerType: string = '';
  customerTypes: string[] = ['Wholesale', 'Retailer', 'Direct Customer', 'Friend', 'Family'];

  constructor(
    private userCustomerService: UserCustomerService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const storedIndex = localStorage.getItem('addCustomerTab');
    const index = storedIndex ? +storedIndex : 0;
    this.activeTab = index >= 0 && index < this.tabs.length ? index : 0;
    this.getUserCustomers();
  }

  tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'financial', label: 'Financial Information' },
    { id: 'address', label: 'Address Details' },
    { id: 'other', label: 'Other Information' },
  ];

  selectTab(index: number) {
    this.activeTab = index;
    localStorage.setItem('addCustomerTab', index.toString());
  }

  getUserCustomers() {
    let params = new HttpParams();
    if (this.selectedCustomerType) {
      params = params.append('user_customer_type', this.selectedCustomerType);
    }

    this.userCustomerService.getUserCustomers(params).subscribe({
      next: (res: any) => {
        this.userCustomerList = res.data;
      },
      error: (err: any) => {
        console.error('Error fetching user customer list:', err);
      }
    });
  }

  onCustomerTypeChange() {
    this.getUserCustomers();
  }

  onDelete(id: number) {
    this.userCustomerService.deleteUserCustomer(id).subscribe({
      next: (res: any) => {
        this.notificationService.showSuccess('Customer Deleted Successfully', 'Success');
        this.getUserCustomers();
      },
      error: (err: any) => {
        console.error('Error deleting user customer:', err);
      }
    });
  }
}
