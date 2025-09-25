import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.css']
})
export class SellComponent implements OnInit {
  activeTab: 'add' | 'return' | null = null;

  onGoClick(type: 'add' | 'return') {
    this.activeTab = type;
    console.log(`Clicked GO for: ${type}`);
  }

  ngOnInit(): void {}
}
