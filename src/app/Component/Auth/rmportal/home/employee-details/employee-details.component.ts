import { Component } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { PersonalDetailsComponent } from "../personal-details/personal-details.component";
import { AttendanceComponent } from "../attendance/attendance.component";

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [NgIf, NgClass, PersonalDetailsComponent, AttendanceComponent],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent {

  activeTab: 'personal' | 'attendance' = 'personal'; 

}
