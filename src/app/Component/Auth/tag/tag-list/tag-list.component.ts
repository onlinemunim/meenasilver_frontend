import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.css'
})
export class TagListComponent implements OnInit{

  ngOnInit(): void {
    initFlowbite();
  }
  
}
