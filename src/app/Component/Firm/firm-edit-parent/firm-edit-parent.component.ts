import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { FirmEditComponent } from '../firm-edit/firm-edit.component';
import { FirmOtherComponent } from '../firm-other/firm-other.component';

@Component({
  selector: 'app-firm-edit-parent',
  standalone: true,
  imports: [FirmEditComponent, FirmOtherComponent],
  templateUrl: './firm-edit-parent.component.html',
  styleUrl: './firm-edit-parent.component.css'
})
export class FirmEditParentComponent {
  ngOnInit(): void {
    initFlowbite();
  }
}
