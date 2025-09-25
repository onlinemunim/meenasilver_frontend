import { Component, inject, OnInit } from '@angular/core';
import { PackageService } from '../../../Services/Package/package.service';
import { FilterService } from '../../../Services/filter.service';
import { HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Package } from '../../../Models/package';
import { Router } from '@angular/router';
import { PackageFilterComponent } from '../package-filter/package-filter.component';  // Correct import here
import { TruncatePipe } from '../../../truncate.pipe';

@Component({
  selector: 'app-package-show',
  standalone: true,
  imports: [NgFor,
    RouterLink,
    NgIf,
    TruncatePipe,
    NgClass,
    TitleCasePipe,
    CurrencyPipe,
    PackageFilterComponent
  ],
  templateUrl: './package-show.component.html',
  styleUrls: ['./package-show.component.css']
})

export class PackageShowComponent implements OnInit {
  router = inject(Router);
  packages: Package[] = [];
  selectedPackage: any;
  isDrawerOpen = false;

  constructor(
    private filterService: FilterService,
    private packageService: PackageService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Subscribe to query parameters to fetch packages on initialization
    this.route.queryParams.subscribe((params: Params) => {
      const queryParams: HttpParams = this.filterService.updateQueryParams(params);
      this.fetchPackages(queryParams);
    });
  }

  fetchPackages(queryParams: HttpParams): void {
    // Fetch packages based on query parameters
    this.packageService.getPackages(queryParams).subscribe(
      (response: any) => {
        if (response?.data) {
          this.packages = response.data;
          console.log('Packages assigned:', this.packages);
        } else {
          console.error('No data found in the response');
        }
      },
      (error) => {
        console.error('Error fetching packages:', error);
        alert('Failed to fetch packages. Please try again.');
      }
    );
  }

  // Method to open the drawer with the selected package details
  openDetailsDrawer(packageDetails: any) {
    this.selectedPackage = packageDetails; // Assign the selected package
    this.isDrawerOpen = true; // Open the drawer
  }

  // Method to close the drawer
  closeDetailsDrawer() {
    this.isDrawerOpen = false; // Close the drawer
    this.selectedPackage = null; // Clear selected package
  }

  // Method to delete a package
  deletePackage(event: Event, id: any): void {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this package?')) {
      this.packageService.deletePackage(id).subscribe(
        (response: any) => {
          if (response?.success) {
            alert('Package deleted successfully!');
            this.packages = this.packages.filter((pkg) => pkg.id !== id);
          } else {
            alert('Failed to delete the package. Please try again.');
          }
        },
        (error) => {
          console.error('Error deleting package:', error);
          alert('Failed to delete the package. Please try again.');
        }
      );
    }
  }
}
