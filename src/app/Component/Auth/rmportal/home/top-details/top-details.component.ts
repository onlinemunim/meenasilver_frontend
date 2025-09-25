import { Component } from '@angular/core';
import { TopCustomersComponent } from '../top-customers/top-customers.component';
import { RecentOrderListComponent } from '../recent-order-list/recent-order-list.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-top-details',
  imports: [TopCustomersComponent, RecentOrderListComponent, NgIf, NgClass],
  templateUrl: './top-details.component.html',
  styleUrl: './top-details.component.css'
})
export class TopDetailsComponent {

  activeTab: 'customers' | 'orders' = 'customers'; 

}
