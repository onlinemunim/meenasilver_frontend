import { Component } from '@angular/core';

@Component({
  selector: 'app-fine-stock-report',
  imports: [],
  templateUrl: './fine-stock-report.component.html',
  styleUrl: './fine-stock-report.component.css'
})
export class FineStockReportComponent {
  goldStock = {
    total: 1440.834,
    net: 1428.554
  };

  silverStock = {
    total: 16902.970,
    net: 16902.970
  };
}
