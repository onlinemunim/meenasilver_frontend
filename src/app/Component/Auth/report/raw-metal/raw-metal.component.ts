import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface StockCard{
link: string;
  title: string;
  mainText: string;
  logoUrl: string;
  details?: { label: string; value: string }[];
  accentColor: string;
  mainTextColor?: string;
  backgroundColor?: string;
}

@Component({
  selector: 'app-raw-metal',
  standalone: true,
  imports: [CommonModule, NgStyle, NgFor, NgIf, RouterLink],
   templateUrl: './raw-metal.component.html',
  styleUrls: ['./raw-metal.component.css']
})
export class RawMetalComponent{
  stockCards: StockCard[] = [

    {
      title: 'Raw Metal Stock',
      mainText: 'Raw Metal Stock',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/10806/10806770.png',
      accentColor: '#ffffff',
      mainTextColor: '#DC143C',
      backgroundColor: '#ffeaea',
      link: '/report/raw-metal-stock',

    },
    {
      title: 'Raw Stone Stock',
      mainText: 'Raw Stone Stock',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/765/765093.png',
      accentColor: '#ffffff',
      mainTextColor: '#006400',
      backgroundColor: '#dcfce6',
      details: [],
      link: '/report/raw-stone-stock-list',
    },

    {
      title: 'Raw GOld ',
      mainText: 'Raw Gold',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/3380/3380422.png',
      accentColor: '#ffffff',
      mainTextColor: '#fe9a00',
      backgroundColor: '#fdffc0',
      details: [],
      link: '/raw-metal/metal',
    },

    {
      title: 'Raw Silver ',
      mainText: 'Raw Silver',
      logoUrl: 'https://img.icons8.com/?size=48&id=E25V8BE03YyT&format=png',
      accentColor: '#ffffff',
      mainTextColor: '#708090',
      backgroundColor: '#f2f2f2',
      details: [],
      link: '/raw-metal/metal',

    },
    {
      title: 'All Raw Metal Stock',
      mainText: 'All Raw Metal Stock',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/10806/10806770.png',
      accentColor: '#ffffff',
      mainTextColor: '#191970',
      backgroundColor: '#e9e9ff',
      details: [],
      link: '/report/all-raw-metal-stock-list',
    },


  ];
}


