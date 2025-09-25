import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';

export interface StockCard {
  title: string;
  mainText: string;
  logoUrl: string;
  details?: { label: string; value: string }[];
  accentColor: string;
  mainTextColor?: string;
  backgroundColor?: string;
}

@Component({
  selector: 'app-other-panel',
  standalone: true,
  imports: [CommonModule, NgStyle, NgFor, NgIf],
 templateUrl: './other-panel.component.html',
  styleUrl: './other-panel.component.css'
})
export class OtherPanelComponent  {
  stockCards: StockCard[] = [
    {
      title: 'Fast Sell Products',
      mainText: 'Trending Product List',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/3237/3237420.png',
      accentColor: '#ffffff',
      mainTextColor: '#6B4226',
      backgroundColor: '#fff9e6',

    },


    {
      title: 'Stock Details with Images',
      mainText: 'Window Shopping Panel',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/765/765093.png',
      accentColor: '#ffffff',
      mainTextColor: '#2e828c',
      backgroundColor: '#e2f6f6',
      details: []
    },

    {
      title: 'Trending Karigar',
      mainText: 'Trending Karigar List',
      logoUrl: 'https://cdn0.iconfinder.com/data/icons/jobsoccuption-3/64/GOLDSMITH-gold-jobs-mine-dig-256.png  ',
      accentColor: '#ffffff',
      mainTextColor: '#DC143C',
      backgroundColor: '#ffeaea',
      details: []
    },
    {
      title: 'Less Sell Products',
      mainText: 'Less Selling Product List',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/8848/8848859.png',
      accentColor: '#ffffff',
      mainTextColor: '#191970',
      backgroundColor: '#e9e9ff',
      details: []
    },
    {
      title: 'Box Movement',
      mainText: 'Box Movement',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/1147/1147307.png',
      accentColor: '#ffffff',
      mainTextColor: '#006400',
      backgroundColor: '#dcfce6',
      details: []
    },

  ];
}
