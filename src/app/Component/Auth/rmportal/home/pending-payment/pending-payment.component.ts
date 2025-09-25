import { Component, OnInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-pending-payment',
  standalone: true,
  imports: [NgFor],
  templateUrl: './pending-payment.component.html',
  styleUrl: './pending-payment.component.css'
})
export class PendingPaymentComponent implements AfterViewInit, OnInit {

  customers = [
    {
      name: 'Shubham Chordia',
      phone: '+91 9175 34 08707',
      location: 'Pune',
      cash: '10,000,00'
    },
    {
      name: 'Shubham Chordia',
      phone: '+91 9175 34 08707',
      location: 'Pune',      
      cash: '10,000,00'
    },
    {
      name: 'Shubham Chordia',
      phone: '+91 9175 34 08707',
      location: 'Pune',
      cash: '10,000,00'
    },
    {
      name: 'Shubham Chordia',
      phone: '+91 9175 34 08707',
      location: 'Pune',
      cash: '10,000,00'
    },
  ]

  groupCustomers(customers: any[], chunkSize: number): any[][] {
    const result = [];
    for (let i = 0; i < customers.length; i += chunkSize) {
      result.push(customers.slice(i, i + chunkSize));
    }
    return result;
  }
  customerGroups: any[][] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.customerGroups = this.groupCustomers(this.customers, 4);
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.customerGroups = this.groupCustomers(this.customers, 4);
  }
}