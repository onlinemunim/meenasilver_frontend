import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cash-details',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './cash-details.component.html',
  styleUrls: ['./cash-details.component.css']
})
export class CashDetailsComponent {

  // Checkbox states  properties
  isCgstChecked: boolean = true;
  isSgstChecked: boolean = true;
  isIgstChecked: boolean = false;
  isOtherTaxChecked: boolean = false;
  isMakingChargeChecked: boolean = false;
  isHallmarkTaxChecked: boolean = false;
  isMetalExchangeChecked: boolean = false;

  onCgstChange(checked: boolean): void {
    this.isCgstChecked = checked;
    this.isSgstChecked = checked;
    if (checked) {
      this.isIgstChecked = false;
    }
  }


  onIgstChange(checked: boolean): void {
    this.isIgstChecked = checked;
    if (checked) {
      this.isCgstChecked = false;
      this.isSgstChecked = false;
    }
  }
}
