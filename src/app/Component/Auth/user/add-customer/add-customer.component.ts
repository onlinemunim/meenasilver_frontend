import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { PersonalInfoComponent } from "../personal-info/personal-info.component";
import { FinancialInfoComponent } from "../financial-info/financial-info.component";
import { AddressDetailsComponent } from "../address-details/address-details.component";
import { OtherInfoComponent } from "../other-info/other-info.component";

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, PersonalInfoComponent, FinancialInfoComponent, AddressDetailsComponent, OtherInfoComponent],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent implements OnInit {
  activeTab = 0;

  tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'financial', label: 'Financial Information' },
    { id: 'address', label: 'Address Details' },
    { id: 'other', label: 'Other Information' },
  ];

  isUserCreated = false;

  ngOnInit(): void {
    this.activeTab = 0;
    localStorage.removeItem('createdUser');
    this.checkUserCreated();
  }

  selectTab(index: number) {
    if (index === 0 || this.isUserCreated) {
      this.activeTab = index;
      localStorage.setItem('addCustomerTab', index.toString());
    }
  }

  checkUserCreated() {
    const user = localStorage.getItem('createdUser');
    this.isUserCreated = !!user;
  }
}
