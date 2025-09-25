import { NotificationService } from './../../../../Services/notification.service';
import { NgFor } from '@angular/common';
import { UserInvestorService } from './../../../../Services/User/Investor/user-investor.service';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Document {
  doc_user_img?: string;
  doc_pan_front_img?: string;
  doc_pan_back_img?: string;
  doc_aadhar_front_img?: string;
  doc_aadhar_back_img?: string;
  [key: string]: any;
}

interface Investor {
  id: number;
  name: string;
  mobilenumber: string;
  gstnumber: string;
  email: string;
  doc_user_img?: string;
  documents?: Document[];
}

@Component({
  selector: 'app-investor-list',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './investor-list.component.html',
  styleUrl: './investor-list.component.css'
})
export class InvestorListComponent implements OnInit {

  userInvestorList: Investor[] = [];

  constructor(
    private userInvestorService: UserInvestorService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.getUserInvestors();
  }

  getUserInvestors() {
    this.userInvestorService.getUserInvestor().subscribe({
      next: (res: any) => {
        this.userInvestorList = res.data;
        console.log('User Investor List:', this.userInvestorList);
      },
      error: (err: any) => {
        console.error('Error fetching user investor list:', err);
        this.notificationService.showError('Failed to load investor list', 'Error');
      }
    });
  }

  onDelete(id: number) {
    if (confirm('Are you sure you want to delete this investor?')) {
      this.userInvestorService.deleteUserInvestor(id).subscribe({
        next: (res: any) => {
          console.log('User Investor Deleted Successfully:');
          this.notificationService.showSuccess(
            'Investor Deleted Successfully',
            'Success'
          );
          this.getUserInvestors();
        },
        error: (err: any) => {
          console.error('Error deleting user investor:', err);
          this.notificationService.showError('Failed to delete investor', 'Error');
        }
      });
    }
  }
}
