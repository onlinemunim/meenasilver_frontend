
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
  selector: 'app-stock-tally',
  standalone: true,
  imports: [CommonModule, NgStyle, NgFor, NgIf],
  templateUrl: './stock-tally.component.html',
  styleUrl: './stock-tally.component.css'
})
export class StockTallyComponent{
  stockCards: StockCard[] = [

    {
      title: 'Stock Tally By RFID/Barcode',
      mainText: 'RFID / Barcode Stock Tally',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/8782/8782880.png',
      accentColor: '#ffffff',
      mainTextColor: '#006400',
      backgroundColor: '#dcfce6',
      details: []
    },

    {
      title: 'Stock Tally Option',
      mainText: 'Imitation Stock Tally',
      logoUrl: 'https://img.icons8.com/?size=80&id=nKBuiYOAYrgz&format=png',
      accentColor: '#ffffff',
      mainTextColor: '#DC143C',
      backgroundColor: '#ffeaea',

    },

    {
      title: 'RFID Tracking Option',
      mainText: 'RFID Tracking',
      logoUrl: 'https://cdn-icons-png.flaticon.com/128/8782/8782880.png',
      accentColor: '#ffffff',
      mainTextColor: '#191970',
      backgroundColor: '#e9e9ff',
      details: []
    },

    {
      title: 'Imitation Stock Tally By RFID',
      mainText: 'RFID Imitation Stock Tally',
      logoUrl: 'https://img.icons8.com/?size=80&id=nKBuiYOAYrgz&format=png',
      accentColor: '#ffffff',
      mainTextColor: '#6B4226',
      backgroundColor: '#fff9e6',
      details: []
    },

  ];
}
