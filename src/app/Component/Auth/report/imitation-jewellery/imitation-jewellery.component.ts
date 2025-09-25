import { routes } from './../../../../app.routes';

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
  selector: 'app-imitation-jewellery',
  standalone: true,
  imports: [CommonModule, NgStyle, NgFor, NgIf, RouterModule],
   templateUrl: './imitation-jewellery.component.html',
  styleUrl: './imitation-jewellery.component.css'
})
export class ImitationJewelleryComponent{
  stockCards: StockCard[] = [

    {
      title: 'Stock details with images',
      mainText: 'Retail Stock List',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/6370/6370400.png',
      accentColor: '#ffffff',
      mainTextColor: '#006400',
      backgroundColor: '#dcfce6',
      route: '/report/immitation-retail-stock-list',
      details: []
    },

    {
      title: 'Stock List By Category',
      mainText: 'Total Available Stock',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/2497/2497789.png',
      accentColor: '#ffffff',
      mainTextColor: '#DC143C',
      backgroundColor: '#ffeaea',
      route: '/report/immitation-total-available-stock-list'

    },

    {
      title: 'Purchase List',
      mainText: 'Purchase List',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/2220/2220721.png',
      accentColor: '#ffffff',
      mainTextColor: '#191970',
      backgroundColor: '#e9e9ff',
      details: [],
      route: '/report/immitation-purchase-list',
    },

    {
      title: 'Stock Details with Images',
      mainText: ' Sterling Jewellery Panel',
      logoUrl: 'https://img.icons8.com/?size=64&id=687TVrPIRrPy&format=png',
      accentColor: '#ffffff',
      mainTextColor: '#6B4226',
      backgroundColor: '#fff9e6',
      details: [],
      route: '/report/immitation-sterling-jewellery-panel-image',
    },



    {
      title: 'Available Sterling Jewellery',
      mainText: 'Sterling Jewellery List',
      logoUrl: 'https://img.icons8.com/?size=64&id=687TVrPIRrPy&format=png',
      accentColor: '#ffffff',
      mainTextColor: '#6B4226',
      backgroundColor: '#fff9e6',
      details: [],
      route: '/report/immitation-sterling-jewellery-panel-list',
    },


    {
      title: 'Stock Details With Images',
      mainText: 'Wholesale Search',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/765/765093.png',
      accentColor: '#ffffff',
      mainTextColor: '#2e828c',
      backgroundColor: '#e2f6f6',
      details: [],
      route: '/report/immitation-wholesale-search-images',
    },
  ];
}
