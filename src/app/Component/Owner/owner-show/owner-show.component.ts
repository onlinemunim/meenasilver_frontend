import { Component, OnInit, inject } from '@angular/core';
import { OwnerService } from '../../../Services/Owner/owner.service';
import { FilterService } from '../../../Services/filter.service';
import { ActivatedRoute, Params, RouterLink, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { OwnerFilterComponent } from '../owner-filter/owner-filter.component';
import { HttpParams } from '@angular/common/http';
import { Owner } from '../../../Models/owner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-owner-show',
  imports: [NgFor, RouterLink, OwnerFilterComponent],
  templateUrl: './owner-show.component.html',
  styleUrl: './owner-show.component.css',
})
export class OwnerShowComponent implements OnInit {
  router = inject(Router);

  owners!: Owner[];
  constructor(
    private filterService: FilterService,
    private ownerService: OwnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const queryParams: HttpParams =
        this.filterService.updateQueryParams(params);
      this.fetchOwners(queryParams);
    });
  }

  fetchOwners(queryParams: HttpParams) {
    this.ownerService.getOwners(queryParams).subscribe((response: any) => {
      this.owners = response.data;
    });
  }

  onDeleteOwner(event: Event, id: any) {
    Swal.fire({
      title: 'Are you sure to delete this owner?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.ownerService.deleteOwner(id).subscribe((response: any) => {
          Swal.fire('Deleted!', 'The owner has been deleted.', 'success');
          this.router.navigate(['/owners']);
        });
      }

    });
    this.router.navigate(['/owners']);
  }
}
