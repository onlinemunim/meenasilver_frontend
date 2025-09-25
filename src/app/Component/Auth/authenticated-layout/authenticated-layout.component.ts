import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SubHeaderComponent } from "../../Core/sub-header/sub-header.component";

@Component({
  selector: 'app-authenticated-layout',
  imports: [RouterOutlet, SubHeaderComponent],
  templateUrl: './authenticated-layout.component.html',
  styleUrl: './authenticated-layout.component.css',
})
export class AuthenticatedLayoutComponent {

}
