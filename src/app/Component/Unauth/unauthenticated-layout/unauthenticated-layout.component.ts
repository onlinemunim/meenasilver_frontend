import { Component, OnInit } from '@angular/core';
import { NewsComponent } from '../../Core/news/news.component';
import { UnauthHeaderComponent } from '../../Core/unauth-header/unauth-header.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-unauthenticated-layout',
  imports: [RouterOutlet, UnauthHeaderComponent, NewsComponent],
  templateUrl: './unauthenticated-layout.component.html',
  styleUrl: './unauthenticated-layout.component.css'
})
export class UnauthenticatedLayoutComponent {
router: any;

}
