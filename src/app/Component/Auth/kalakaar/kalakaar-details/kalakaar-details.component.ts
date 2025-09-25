import { NgClass, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PersonalDetailsComponent } from '../personal-details/personal-details.component';
import { PaymentDetailsComponent } from '../payment-details/payment-details.component';

@Component({
  selector: 'app-kalakaar-details',
  imports: [NgIf, NgClass, PersonalDetailsComponent, PaymentDetailsComponent],
  templateUrl: './kalakaar-details.component.html',
  styleUrl: './kalakaar-details.component.css'
})
export class KalakaarDetailsComponent implements OnChanges{

  activeTab: 'personal' | 'payment' = 'personal';

  @Input() data: any[] = [];
  kalakarData!: any[];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.kalakarData = this.data;
    }
  }

}
