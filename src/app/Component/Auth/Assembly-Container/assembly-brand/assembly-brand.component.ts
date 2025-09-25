import { Component } from '@angular/core';
import { AssemblyBrandsService } from '../../../../Services/Assembly-Brands/assembly-brands.service';
import { NotificationService } from '../../../../Services/notification.service';
import { NavbarService } from '../../../../Services/navbar.service';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-assembly-brand',
  imports: [FormsModule,NgIf,NgFor],
  templateUrl: './assembly-brand.component.html',
  styleUrl: './assembly-brand.component.css'
})
export class AssemblyBrandComponent {

  newBrandName: string = '';
  brandList:any[] = [];
  isLoading = true;

  constructor(
    private assemblyBrandService:AssemblyBrandsService,
    private notificationService: NotificationService,
    private navbarService: NavbarService,
  ){
    this.getBrands();
  }

  saveBrandName(){
    const payload = {
      assembly_brand_name : this.newBrandName
    };

    this.assemblyBrandService.createAssemblyBrand(payload).subscribe({
      next:()=>{
        this.notificationService.showSuccess(`Brand "${this.newBrandName}" added successfully.`, 'success');
        this.newBrandName = '';
        // this.navbarService.getBrands();
        this.getBrands();
      },
      error:(err)=>{
        this.notificationService.showError('Failed to save brand.', 'Add Brand');
        console.error('Add brand error:', err);
      }
    })
  }

  getBrands(){
    this.assemblyBrandService.getAssemblyBrands().subscribe({
      next:(response:any)=>{
        this.brandList = response.data;
        this.isLoading = false;
      },
      error:(err)=>{
        console.error('Fetch brands error:', err);
        this.isLoading = false;
      }
    })
  }

  deleteBrang(id:any){
    this.assemblyBrandService.deleteAssemblyBrand(id).subscribe({
      next:()=>{
        this.notificationService.showSuccess(`Brand Deleted successfully.`, 'success');
        // this.navbarService.getBrands();
        this.getBrands();
      },
      error:(err)=>{
        this.notificationService.showError('Failed to Delete brand.', 'Delete Brand');
        console.error('Delete brand error:', err);
      }
    })
  }
}
