import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageService } from '../../../Services/Package/package.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { inject } from '@angular/core';

@Component({
  selector: 'app-singlepackage-show',
  imports: [NgIf,NgFor,CommonModule],
  templateUrl: './singlepackage-show.component.html',
  styleUrls: ['./singlepackage-show.component.css']  // Corrected styleUrl to styleUrls
})
export class SinglepackageShowComponent implements OnInit {
  selectedPackage: any = null;  // To store selected package details
  isModalOpen: boolean = false;  // To control modal visibility
  router = inject(Router);

  constructor(
    private packageService: PackageService,
    private route: ActivatedRoute  // Inject ActivatedRoute to access route parameters
  ) { }

  ngOnInit() {
    // Get the dynamic ID from the URL parameters
    const packageId = this.route.snapshot.paramMap.get('id');

    if (packageId) {
      this.loadPackageById(packageId);  // Load package by ID
    }
  }

  loadPackageById(id: string) {
    this.packageService.getPackage(id).subscribe((data) => {
      console.log("single data",data.data);
      this.selectedPackage = data.data;  // Store the fetched package in selectedPackage
    });
  }



  // Method to close the modal
  closeModal() {
    console.log("innnnnn");
    this.router.navigate(['/packages']);
  }

}
