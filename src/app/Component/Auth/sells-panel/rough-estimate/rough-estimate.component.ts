import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rough-estimate',
  imports: [NgIf],
  templateUrl: './rough-estimate.component.html',
  styleUrl: './rough-estimate.component.css'
})
export class RoughEstimateComponent implements OnInit {
  isLoading: boolean = true;

  ngOnInit() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
