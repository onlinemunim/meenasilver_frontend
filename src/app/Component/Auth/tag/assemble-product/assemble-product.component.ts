import { Component } from '@angular/core';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';

@Component({
  selector: 'app-assemble-product',
  imports: [CustomSelectComponent],
  templateUrl: './assemble-product.component.html',
  styleUrl: './assemble-product.component.css'
})
export class AssembleProductComponent {

  // for Product Category
  productCategory: string[] =[
    '',
  ];
  selectedCategory: string = '';

}
