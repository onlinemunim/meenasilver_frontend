import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { RouterModule } from '@angular/router';


export interface StockCard {
  title: string;
  mainText: string;
  logoUrl: string;
  details?: { label: string; value: string }[];
  accentColor: string;
  mainTextColor?: string;
  backgroundColor?: string;
  route?: string;
}

@Component({
  selector: 'app-fine-jewellery',
  standalone: true,
  imports: [CommonModule, NgStyle, NgFor, NgIf, RouterModule,],
  templateUrl: './fine-jewellery.component.html',
})
export class FineJewelleryComponent {
  stockCards: StockCard[] = [
    {
      title: 'Available Stock by Category',
      mainText: 'Gold-Silver Stock',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/2497/2497789.png',
      accentColor: '#ffffff',
      mainTextColor: '#6B4226',
      backgroundColor: '#fff9e6',
      route: '/report/gold-silver-stock',
      details: [
        { label: 'Gold', value: '1440.834 GM' },
        { label: 'Silver', value: '16902.970 GM' }
      ]
    },

    {
      title: 'Available Stock by Category',
      mainText: 'Gold Stock',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/6466/6466968.png',
      accentColor: '#ffffff',
      mainTextColor: '#fe9a00',
      backgroundColor: '#ffffe7',
      route: '/report/gold-stock',
      details: [
        { label: 'GW WT', value: '1440.834 GM' },
        { label: 'NT WT', value: '1428.554 GM' }
      ]

    },
    {
      title: 'Available Stock by Category',
      mainText: 'Silver Stock',
      logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTU8PQV4HgE-UXwaxP_rHS-kqMxGRNu-iWAyw&s',
      accentColor: '#ffffff',
      mainTextColor: '#708090',
      backgroundColor: '#f2f2f2',
      route: '/report/silver-stock',
      details: [
        { label: 'GW WT', value: '16902.970 GM' },
        { label: 'NT WT', value: '16902.970 GM' }
      ]
    },
    {
      title: 'Stock Details with Images',
      mainText: 'Jewellery Panel',
      logoUrl: 'https://img.icons8.com/?size=64&id=687TVrPIRrPy&format=png',
      accentColor: '#ffffff',
      mainTextColor: '#4169E1',
      backgroundColor: '#eaf1fb',
      route: '/report/jewellery-panel-list',
      details: []
    },
    {
      title: 'Stock Details with Images',
      mainText: 'Wholesale Search',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/765/765093.png',
      accentColor: '#ffffff',
      mainTextColor: '#2e828c',
      backgroundColor: '#e2f6f6',
      route: '/report/wholesale-search-list',
      details: []
    },
    {
      title: 'Sold Out Stock Details with Images',
      mainText: 'Sold Out Stock List',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/5267/5267510.png',
      accentColor: '#ffffff',
      mainTextColor: '#DC143C',
      backgroundColor: '#ffeaea',
      route: '/report/sold-out-stock-list',
      details: []
    },
    {
      title: 'Sold Out Stock List with Images',
      mainText: 'Sold Out Stock List',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/5267/5267510.png',
      accentColor: '#ffffff',
      mainTextColor: '#DC143C',
      backgroundColor: '#ffeaea',
      route: '/report/sold-out-stock-list2-list',
      details: []
    },
    {
      title: 'Retail Stock List',
      mainText: 'Retail Stock List',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/6370/6370400.png',
      accentColor: '#ffffff',
      mainTextColor: '#006400',
      backgroundColor: '#dcfce6',
      route:'/report/retail-stock-list-list',
      details: []
    },
    {
      title: 'Purchase List with Category',
      mainText: 'Purchase Stock List',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/2220/2220721.png',
      accentColor: '#ffffff',
      mainTextColor: '#191970',
      backgroundColor: '#e9e9ff',
      route: '/report/purchase-stock-category-list-list',
      details: []
    },
    {
      title: 'Purchase List',
      mainText: 'Purchase Stock List',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/2220/2220721.png',
      accentColor: '#ffffff',
      mainTextColor: '#191970',
      backgroundColor: '#e9e9ff',
      route: '/report/purchase-stock-list-list',
      details: []
    }
  ];
}
