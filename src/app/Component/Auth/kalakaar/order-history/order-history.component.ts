import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(isoWeek);

@Component({
  selector: 'app-order-history',
  imports: [NgIf, NgClass],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];

  activeTab: 'day' | 'week' | 'month' | 'year' = 'month';
  activeDateLabel: string = '';
  orderStats = { current: 0, completed: 0, pending: 0, rejected: 0 };

  private currentDate = dayjs();

  ngOnInit(): void {
    this.setActiveTab(this.activeTab);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.filterOrders();
    }
  }

  setActiveTab(tab: 'day' | 'week' | 'month' | 'year') {
    this.activeTab = tab;
    this.updateLabel();
    this.filterOrders();
  }

  navigate(direction: 'prev' | 'next') {
    switch (this.activeTab) {
      case 'day':
        this.currentDate = direction === 'prev'
          ? this.currentDate.subtract(1, 'day')
          : this.currentDate.add(1, 'day');
        break;
      case 'week':
        this.currentDate = direction === 'prev'
          ? this.currentDate.subtract(1, 'week')
          : this.currentDate.add(1, 'week');
        break;
      case 'month':
        this.currentDate = direction === 'prev'
          ? this.currentDate.subtract(1, 'month')
          : this.currentDate.add(1, 'month');
        break;
      case 'year':
        this.currentDate = direction === 'prev'
          ? this.currentDate.subtract(1, 'year')
          : this.currentDate.add(1, 'year');
        break;
    }
    this.updateLabel();
    this.filterOrders();
  }

  private updateLabel() {
    switch (this.activeTab) {
      case 'day':
        this.activeDateLabel = this.currentDate.format('DD-MMM-YYYY');
        break;
      case 'week':
        this.activeDateLabel = `${this.currentDate.startOf('week').format('DD MMM')} - ${this.currentDate
          .endOf('week')
          .format('DD MMM YYYY')}`;
        break;
      case 'month':
        this.activeDateLabel = this.currentDate.format('MMMM YYYY');
        break;
      case 'year':
        this.activeDateLabel = this.currentDate.format('YYYY');
        break;
    }
  }

  private filterOrders() {
    if (!this.data || this.data.length === 0) {
      this.orderStats = { current: 0, completed: 0, pending: 0, rejected: 0 };
      return;
    }

    const filteredOrders = this.data.filter((order: any) => {
      const created = dayjs(order.created_at);
      switch (this.activeTab) {
        case 'day':   return created.isSame(this.currentDate, 'day');
        case 'week':  return created.isSame(this.currentDate, 'week');
        case 'month': return created.isSame(this.currentDate, 'month');
        case 'year':  return created.isSame(this.currentDate, 'year');
        default:      return true;
      }
    });

    this.orderStats = { current: 0, completed: 0, pending: 0, rejected: 0 };
    this.orderStats.current = filteredOrders.length;

    filteredOrders.forEach((order: any) => {
      switch (order.status?.toLowerCase()) {
        case 'completed': this.orderStats.completed++; break;
        case 'pending':   this.orderStats.pending++; break;
        case 'rejected':  this.orderStats.rejected++; break;
      }
    });
  }
}
