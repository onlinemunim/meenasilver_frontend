import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AssemblyBrandsService } from '../../../../Services/Assembly-Brands/assembly-brands.service';

@Component({
  selector: 'app-assembly-container',
  standalone: true,
  imports: [RouterLink,RouterModule, NgFor, NgIf],
  templateUrl: './assembly-container.component.html',
  styleUrls: ['./assembly-container.component.css']
})
export class AssemblyContainerComponent implements OnDestroy {
  isLoading = true;
  id: string = '';
  brandName: string = '';
  private routeSub!: Subscription;

  submenu: { path: string; lable: string; visible: boolean }[] = [];

  constructor(
    private route: ActivatedRoute,
    private assemblyBrandsService: AssemblyBrandsService
  ) {
    // listen for id changes in route
    this.routeSub = this.route.paramMap.subscribe(params => {
      this.id = params.get('id') ?? '';
      console.log('Id changed:', this.id);

      if (this.id) {
        this.getBrandName(this.id);
        this.buildSubmenu(this.id); // ✅ rebuild submenu dynamically
      }
    });
  }

  private buildSubmenu(id: string) {
    this.submenu = [
      { path: `/product-creation/${id}`, lable: 'Create Product', visible: true },
      { path: `/raw-metal/metal/${id}`, lable: 'Add Raw Material', visible: true },
      { path: `/orders-creation`, lable: 'Order Creation', visible: true },
      { path: `/design-product/${id}`, lable: 'Designed Product List', visible: true },
      { path: `/available-to-produce/${id}`, lable: 'Available To Produce (ATP)', visible: true },
      { path: `/material-requirement-sheet/${id}`, lable: 'Material Requirement Sheet (MRS)', visible: true },
      { path: `/combo-creation/${id}`, lable: 'Combo Creation', visible: true },
    ];
  }

  getBrandName(id: string) {
    this.isLoading = true;
    console.log('passed id is', id);

    this.assemblyBrandsService.getAssemblyBrand(id).subscribe({
      next: (response: any) => {
        this.brandName = response.data.assembly_brand_name;
        console.log('Brand name is', this.brandName);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching brand', err);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }
}
