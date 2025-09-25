import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserStaffService } from '../../../../Services/User/Staff/user-staff.service';
import { NotificationService } from '../../../../Services/notification.service';
import { environment } from '../../../../../environments/environment';

// Interface to define the structure of a Staff member object
interface City {
  name: string;
}

interface Address {
  city: City;
}

interface Document {
  doc_user_img?: string;
  doc_pan_front_img?: string;
  doc_pan_back_img?: string;
  doc_aadhar_front_img?: string;
  doc_aadhar_back_img?: string;
  [key: string]: any;
}

interface Staff {
  id: number;
  name: string;
  mobilenumber: string;
  user_dob: Date;
  email: string;
  documents: Document[];
  addresses: Address[];
  doc_user_img?: string;
}

@Component({
  selector: 'app-staff-list',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {

  userStaffList: Staff[] = [];

  constructor(
    private userStaffService: UserStaffService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.getUserStaff();
  }

  /**
   * Fetches the list of staff members from the service.
   */
  getUserStaff() {
    this.userStaffService.getUserStaff().subscribe({
      next: (res: any) => {
        this.userStaffList = res.data;
        console.log('User Supplier List:', this.userStaffList);
      },
      error: (err: any) => {
        console.error('Error fetching user supplier list:', err);
      }
    });
  }

  onDelete(id: number): void {

    this.userStaffService.deleteUserStaff(id).subscribe({
      next: (res: any) => {
        this.notificationService.showSuccess('Staff member deleted successfully', 'Success');
        this.getUserStaff();
      },
      error: (err: any) => {
        console.error('Error deleting staff member:', err);
        this.notificationService.showError('Failed to delete staff member', 'Error');
      }
    });
  }
}
