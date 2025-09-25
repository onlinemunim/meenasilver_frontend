import { Component } from '@angular/core';

@Component({
  selector: 'app-incentives',
  standalone: true,
  imports: [],
  templateUrl: './incentives.component.html',
  styleUrl: './incentives.component.css'
})
export class IncentivesComponent {

  activeTab: 'analysis' | 'incentives' = 'analysis';

}
