import { Component } from '@angular/core';
import { CustomSelectComponent } from './../../../Core/custom-select/custom-select.component';

@Component({
  selector: 'app-stone-form',
  standalone: true,
  imports: [CustomSelectComponent],
  templateUrl: './stone-form.component.html',
  styleUrl: './stone-form.component.css'
})
export class StoneFormComponent {

  // 🔸 Form visibility control
  showForm: boolean = true;

  // for metal types
  metalTypes: string[] = ['Gold'];
  selectedMetal: string = '';

  // for Item Category
  itemCategory: string[] = ['Ring'];
  selectedItem: string = '';

  // for Size
  sizeRange: string[] = ['10 X 10'];
  selectedSize: string = '';

  // for Color
  colorTypes: string[] = ['White'];
  selectedColor: string = '';

  // for unit
  unitTypes: string[] = ['GM'];
  selectedUnit: string = '';

  // ✅ Delete the form (hide it)
  deleteForm(): void {
    this.showForm = false;
  }
}
