import { Component } from '@angular/core';
import { SalesTargetAnalysisComponent } from '../sales-target-analysis/sales-target-analysis.component';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-sales-target',
  standalone: true,
  imports: [SalesTargetAnalysisComponent, NgIf, NgClass],
  templateUrl: './sales-target.component.html',
  styleUrl: './sales-target.component.css'
})
export class SalesTargetComponent {

  activeTab: 'month' | 'year' = 'month'; 

}
