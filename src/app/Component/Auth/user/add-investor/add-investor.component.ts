import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { InvestorPersonalComponent } from "../investor-personal/investor-personal.component";
import { FinancialInfoComponent } from "../financial-info/financial-info.component";
import { AddressDetailsComponent } from "../address-details/address-details.component";
import { OtherInfoComponent } from "../other-info/other-info.component";

@Component({
  selector: 'app-add-investor',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, InvestorPersonalComponent, FinancialInfoComponent, AddressDetailsComponent, OtherInfoComponent],
  templateUrl: './add-investor.component.html',
  styleUrl: './add-investor.component.css'
})
export class AddInvestorComponent implements OnInit {
  activeTab = 0;
  isUserCreated = false;

  tabs = [
    { id: 'personal', label: 'Personal Information' },
    { id: 'financial', label: 'Financial Information' },
    { id: 'address', label: 'Address Details' },
    { id: 'other', label: 'Other Information' },
  ];

  ngOnInit(): void {
    this.activeTab = 0;
    localStorage.removeItem('createdUser');
    this.checkUserCreated();
  }

  selectTab(index: number) {
    if (index === 0 || this.isUserCreated) {
      this.activeTab = index;
      localStorage.setItem('addInvestorTab', index.toString());
    }
  }

  checkUserCreated() {
    const user = localStorage.getItem('createdUser');
    this.isUserCreated = !!user;
  }
}
