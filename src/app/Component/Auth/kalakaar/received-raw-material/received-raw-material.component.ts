import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-received-raw-material',
  imports: [NgIf, NgClass],
  templateUrl: './received-raw-material.component.html',
  styleUrl: './received-raw-material.component.css'
})
export class ReceivedRawMaterialComponent {

  activeTab: 'day' | 'week' | 'month' | 'year' = 'month';

}
