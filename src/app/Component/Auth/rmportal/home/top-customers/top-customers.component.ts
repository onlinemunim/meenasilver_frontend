import { Component, OnInit, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { register } from 'swiper/element';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-top-customers',
  standalone: true,
  imports: [NgFor],
  templateUrl: './top-customers.component.html',
  styleUrl: './top-customers.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TopCustomersComponent implements AfterViewInit, OnInit {

  customers = [
    {
      name: 'Shubham Chordia',
      phone: '+91 9175 34 08707',
      location: 'Pune',
      orderId: 'LR12',
      prodName: 'L. Ring',
      qty: 50,
      weight: '100.20 Gm',
      amount: '75,000.00'
    },
    {
      name: 'Shubham Chordia',
      phone: '+91 9175 34 08707',
      location: 'Pune',
      orderId: 'LR12',
      prodName: 'L. Ring',
      qty: 50,
      weight: '100.20 Gm',
      amount: '75,000.00'
    },
    {
      name: 'Shubham Chordia',
      phone: '+91 9175 34 08707',
      location: 'Pune',
      orderId: 'LR12',
      prodName: 'L. Ring',
      qty: 50,
      weight: '100.20 Gm',
      amount: '75,000.00'
    },
    {
      name: 'Shubham Chordia',
      phone: '+91 9175 34 08707',
      location: 'Pune',
      orderId: 'LR12',
      prodName: 'L. Ring',
      qty: 50,
      weight: '100.20 Gm',
      amount: '75,000.00'
    },
    {
      name: 'Shubham Chordia',
      phone: '+91 9175 34 08707',
      location: 'Pune',
      orderId: 'LR12',
      prodName: 'L. Ring',
      qty: 50,
      weight: '100.20 Gm',
      amount: '75,000.00'
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

  @ViewChild('swiper', { static: false }) swiperRef!: ElementRef;

  swiperConfig: any = {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: 500,
    grabCursor: true,
    mousewheel: true,
    freeMode: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      320: { slidesPerView: 1, spaceBetween: 10 },
      992: { slidesPerView: 1, spaceBetween: 15 },
      1200: { slidesPerView: 1, spaceBetween: 20 },
      1400: { slidesPerView: 1, spaceBetween: 20 },
    },
  };

  swiperInstance: Swiper | null = null;

  ngAfterViewInit() {
    this.customerGroups = this.groupCustomers(this.customers, 4);
    register(); 
    setTimeout(() => {
      if (this.swiperRef?.nativeElement instanceof HTMLElement) {
        this.swiperInstance = new Swiper(
          this.swiperRef.nativeElement,
          this.swiperConfig
        );
        this.swiperInstance.update();
      }
    }, 0);
  }
} {

}
