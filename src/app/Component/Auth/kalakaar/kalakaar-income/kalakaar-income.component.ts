import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf, NgClass, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-kalakaar-income',
  imports: [NgIf, NgClass, DecimalPipe],
  templateUrl: './kalakaar-income.component.html',
  styleUrl: './kalakaar-income.component.css'
})
export class KalakaarIncomeComponent implements OnChanges {

  activeTab: 'day' | 'week' | 'month' | 'year' = 'month';
  @Input() data: any[] = [];

  completedOrders: number = 0;
  totalIncome: number = 0;
  displayDate: string = '';
  displayBaseDate: Date = new Date();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.calculateIncome();
    }
  }

  changeTab(tab: 'day' | 'week' | 'month' | 'year') {
    this.activeTab = tab;
    this.calculateIncome();
  }

  private calculateIncome() {
    if (!this.data) return;

    const now = this.displayBaseDate;

    const filtered = this.data.filter(order => {
      if (order.status !== 'completed') return false;
      const createdAt = new Date(order.created_at);

      switch (this.activeTab) {
        case 'day':
          return createdAt.toDateString() === now.toDateString();
        case 'week': {
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          startOfWeek.setHours(0, 0, 0, 0);
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          return createdAt >= startOfWeek && createdAt <= endOfWeek;
        }
        case 'month':
          return createdAt.getMonth() === now.getMonth() &&
                 createdAt.getFullYear() === now.getFullYear();
        case 'year':
          return createdAt.getFullYear() === now.getFullYear();
      }
    });

    this.completedOrders = filtered.length;
    this.totalIncome = filtered.reduce((sum, o) => sum + parseFloat(o.final_value), 0);

    // 👇 Dynamic display date
    switch (this.activeTab) {
      case 'day':
        this.displayDate = now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        break;
      case 'week': {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        // Format as "05 Sep - 11 Sep"
        const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
        const startStr = startOfWeek.toLocaleDateString('en-GB', options);
        const endStr = endOfWeek.toLocaleDateString('en-GB', options);

        this.displayDate = `${startStr} - ${endStr}`;
        break;
    }
      case 'month':
        this.displayDate = now.toLocaleString('en-GB', { month: 'long', year: 'numeric' }); // September 2025
        break;
      case 'year':
        this.displayDate = now.getFullYear().toString();
        break;
    }
  }

  navigate(direction: 'prev' | 'next') {
    const step = direction === 'next' ? 1 : -1;

    switch (this.activeTab) {
      case 'day':
        this.displayBaseDate.setDate(this.displayBaseDate.getDate() + step);
        break;
      case 'week':
        this.displayBaseDate.setDate(this.displayBaseDate.getDate() + step * 7);
        break;
      case 'month':
        this.displayBaseDate.setMonth(this.displayBaseDate.getMonth() + step);
        break;
      case 'year':
        this.displayBaseDate.setFullYear(this.displayBaseDate.getFullYear() + step);
        break;
    }

    this.calculateIncome();
  }
}
