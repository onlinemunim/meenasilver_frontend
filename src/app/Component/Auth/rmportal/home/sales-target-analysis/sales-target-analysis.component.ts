import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { IncentivesComponent } from "../incentives/incentives.component";

@Component({
  selector: 'app-sales-target-analysis',
  standalone: true,
  imports: [NgIf, NgClass, IncentivesComponent],
  templateUrl: './sales-target-analysis.component.html',
  styleUrl: './sales-target-analysis.component.css'
})
export class SalesTargetAnalysisComponent {

  activeTab: 'analysis' | 'incentives' = 'analysis';

}
