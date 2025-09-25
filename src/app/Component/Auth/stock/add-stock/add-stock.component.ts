import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-stock',
  standalone: true,
  imports: [NgIf, NgClass, RouterOutlet, RouterLink],
  templateUrl: './add-stock.component.html',
  styleUrls: ['./add-stock.component.css']
})
export class AddStockComponent {

  mobileMenuOpen = false;
  screenIsSmall = false;

  showFineStockDropdown = false;
  showImitationDropdown = false;
  showStockReportsDropdown = false;
  showOtherOptionsDropdown = false;

  selectedStockLabel = 'Fine Stock';           // Default Fine Stock label
  selectedImitationStockLabel = 'Imitation Stock'; // Default Imitation Stock label

  stockItems = [
    'Add Fine Stock B1',
    'Add Fine Stock B1 Scroll',
    'Add Fine Stock B2',
    'Add Fine Stock B3',
    'Add CAD Stock',
    'Add Metal Form B2'
  ];

  ngOnInit() {
    this.screenIsSmall = window.innerWidth < 1024;
    window.addEventListener('resize', () => {
      this.screenIsSmall = window.innerWidth < 1024;
      if (!this.screenIsSmall) {
        this.mobileMenuOpen = false;
      }
    });
  }

  toggleDropdown(type: string) {
    this.showFineStockDropdown = type === 'fine' ? !this.showFineStockDropdown : false;
    this.showImitationDropdown = type === 'imitation' ? !this.showImitationDropdown : false;
    this.showStockReportsDropdown = type === 'reports' ? !this.showStockReportsDropdown : false;
    this.showOtherOptionsDropdown = type === 'others' ? !this.showOtherOptionsDropdown : false;
  }

  closeDropdown(type: string) {
    if (type === 'fine') this.showFineStockDropdown = false;
    if (type === 'imitation') this.showImitationDropdown = false;
    if (type === 'reports') this.showStockReportsDropdown = false;
    if (type === 'others') this.showOtherOptionsDropdown = false;
  }

  /**
   * Select a stock item and update the appropriate dropdown label.
   * @param type - dropdown type: 'Fine' or 'Imitation'
   * @param item - selected item name
   */
  selectStock(type: string, item: string) {
    if (type === 'Fine') {
      this.selectedStockLabel = item;
      this.selectedImitationStockLabel = 'Imitation Stock'; // Reset the other
      this.closeDropdown('fine');
    } else if (type === 'Imitation') {
      this.selectedImitationStockLabel = item;
      this.selectedStockLabel = 'Fine Stock'; // Reset the other
      this.closeDropdown('imitation');
    }
  }
}
