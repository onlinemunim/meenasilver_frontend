import { Component} from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-add-ready-product',
  standalone:true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './add-ready-product.component.html',
  styleUrl: './add-ready-product.component.css',
})
export class AddReadyProductComponent {

}
