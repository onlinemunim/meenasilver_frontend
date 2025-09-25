import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-alluser-list',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './alluser-list.component.html',
  styleUrl: './alluser-list.component.css'
})
export class AlluserListComponent  implements OnInit {
  listTitle: string = 'Customer List';
  addUserText: string = 'Add Customer';
  addUserLink: string = '/create-user/add-customer';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;

      if (url.includes('customer-list')) {
        this.listTitle = 'Customer List';
        this.addUserText = 'Add Customer';
        this.addUserLink = '/create-user/add-customer';
      } else if (url.includes('staff-list')) {
        this.listTitle = 'Staff List';
        this.addUserText = 'Add Staff';
        this.addUserLink = '/create-user/add-staff';
      } else if (url.includes('supplier-list')) {
        this.listTitle = 'Supplier List';
        this.addUserText = 'Add Supplier';
        this.addUserLink = '/create-user/add-supplier';
      } else if (url.includes('investor-list')) {
        this.listTitle = 'Investor List';
        this.addUserText = 'Add Investor';
        this.addUserLink = '/create-user/add-investor';
      }
    });
  }
}
