import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-stock-overview',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './stock-overview.component.html',
  styleUrl: './stock-overview.component.css'
})
export class StockOverviewComponent {
  
  activeTab: 'day' | 'week' | 'month' | 'year' = 'day';

}
