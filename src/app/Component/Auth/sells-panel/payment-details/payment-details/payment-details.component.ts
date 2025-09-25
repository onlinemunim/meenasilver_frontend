import { Component } from '@angular/core';
import { PaymentPanelComponent } from '../payment-panel/payment-panel.component';
import { CashDetailsComponent } from '../cash-details/cash-details.component';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [PaymentPanelComponent],
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.css']
})
export class PaymentDetailsComponent {}
