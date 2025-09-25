import { Component } from '@angular/core';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';

@Component({
  selector: 'app-fine-product',
  imports: [CustomSelectComponent],
  templateUrl: './fine-product.component.html',
  styleUrl: './fine-product.component.css'
})
export class FineProductComponent {

   // for Product Category
   productCategory: string[] =[
    '',
  ];
  selectedCategory: string = '';

}
