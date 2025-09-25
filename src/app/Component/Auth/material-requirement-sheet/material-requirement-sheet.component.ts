import { Component } from '@angular/core';
import { CustomSelectComponent } from '../../Core/custom-select/custom-select.component';

@Component({
  selector: 'app-material-requirement-sheet',
  imports: [CustomSelectComponent],
  templateUrl: './material-requirement-sheet.component.html',
  styleUrl: './material-requirement-sheet.component.css'
})
export class MaterialRequirementSheetComponent {

  // Select Product
  productType: string[] = ['Wholesale'];
  selectedProduct: string = '';

}
