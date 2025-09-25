import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FirmGeneralComponent } from '../firm-general/firm-general.component';
import { FirmOtherComponent } from '../firm-other/firm-other.component';

@Component({
  selector: 'app-firm-create',
  standalone: true,
  imports: [FirmGeneralComponent, FirmOtherComponent],
  templateUrl: './firm-create.component.html',
  styleUrl: './firm-create.component.css'
})
export class FirmCreateComponent {
  ngOnInit(): void {
    initFlowbite()
  }
}
