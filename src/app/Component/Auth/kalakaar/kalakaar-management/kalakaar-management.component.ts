import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { UserSupplierService } from '../../../../Services/User/Supplier/user-supplier.service';

@Component({
  selector: 'app-kalakaar-management',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './kalakaar-management.component.html',
  styleUrl: './kalakaar-management.component.css'
})
export class KalakaarManagementComponent  implements OnInit{

  userKalakarData: any[] = [];

  constructor(private userSupplierService: UserSupplierService) { }

  ngOnInit(): void {
    this.getSelectedSupplier(localStorage.getItem('supplierId') || '');
  }

  getSelectedSupplier(supplierId: string) {
    this.userSupplierService.getUserSupplierById(+supplierId).subscribe({
      next: (res: any) => {
        this.userKalakarData = [res.data];
      },
      error: (err: any) => {
        console.error('Error fetching selected supplier:', err);
      }
    });
  }
}
