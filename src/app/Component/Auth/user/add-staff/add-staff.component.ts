import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { StaffPersonalComponent } from "../staff-personal/staff-personal.component";
import { FinancialInfoComponent } from "../financial-info/financial-info.component";
import { AddressDetailsComponent } from "../address-details/address-details.component";
import { EmploymentInfoComponent } from '../employment-info/employment-info.component';

@Component({
  selector: 'app-add-staff',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, StaffPersonalComponent, FinancialInfoComponent, AddressDetailsComponent, EmploymentInfoComponent],
  templateUrl: './add-staff.component.html',
  styleUrl: './add-staff.component.css'
})
export class AddStaffComponent implements OnInit {
  activeTab = 0;
  isUserCreated = false;

  tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'financial', label: 'Financial Information' },
    { id: 'address', label: 'Address Details' },
    { id: 'employment', label: 'Employment Information' },
  ];

  ngOnInit(): void {
    this.activeTab = 0;
    localStorage.removeItem('createdUser');
    this.checkUserCreated();
  }

  selectTab(index: number) {
    if (index === 0 || this.isUserCreated) {
      this.activeTab = index;
      localStorage.setItem('addStaffTab', index.toString());
    }
  }

  checkUserCreated() {
    const user = localStorage.getItem('createdUser');
    this.isUserCreated = !!user;
  }
}
