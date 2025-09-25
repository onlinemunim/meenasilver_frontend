import { Component, inject, OnInit } from '@angular/core';
import { OwnerService } from '../../../Services/Owner/owner.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Owner } from '../../../Models/owner';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-owner-single',
  imports: [RouterLink, NgIf],
  templateUrl: './owner-single.component.html',
  styleUrl: './owner-single.component.css'
})
export class OwnerSingleComponent implements OnInit {
  activateroute = inject(ActivatedRoute);

  router = inject(Router);

  id: any;
  owner!: Owner;

  constructor(private ownerService: OwnerService) {
  }

  ngOnInit() {

    this.id = this.activateroute.snapshot.params['id'];

    this.fetchOwner();
  }

  fetchOwner() {
    this.ownerService.getOwner(this.id).subscribe((data: any) => {
      this.owner = data.data;
    })
  }
}
