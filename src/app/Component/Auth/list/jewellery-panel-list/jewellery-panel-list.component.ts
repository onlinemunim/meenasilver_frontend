
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-jewellery-panel-list',
  standalone: true,
  imports: [CommonModule], // Import CommonModule to use *ngFor
  templateUrl: './jewellery-panel-list.component.html',
  styleUrls: ['./jewellery-panel-list.component.css']
})
export class JewelleryPanelListComponent {

  // Array to hold the product data. We'll repeat the same item 12 times to match the UI.
  products = new Array(12).fill({
    name: 'Mangalsutra Design',
    details: 'PRS6 I Silver I 92% I MKG: 0/g',
    grossWeight: '55.000 g',
    netWeight: '55.000 g',
    quantity: '1 Piece',
    price: '₹ 35,60,000',
    imageUrl: 'https://cdn-icons-png.flaticon.com/128/15695/15695721.png' // Placeholder image URL
  });

}
