import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './staff-dashboard.component.html',
  styleUrl: './staff-dashboard.component.css'
})
export class StaffDashboardComponent {

}
