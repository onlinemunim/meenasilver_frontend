import { Component } from '@angular/core';
import { CustomSelectComponent } from '../../Core/custom-select/custom-select.component';

@Component({
  selector: 'app-available-to-produce',
  imports: [CustomSelectComponent],
  templateUrl: './available-to-produce.component.html',
  styleUrl: './available-to-produce.component.css'
})
export class AvailableToProduceComponent {

   // Select Product
  productType: string[] = ['Wholesale'];
  selectedProduct: string = '';

   // Select Product
  prodType: string[] = ['ATP',];
  selectedProd: string = 'ATP';

}
