import { Component, OnInit } from '@angular/core';
import { UserServiceService } from '../../../Services/user.service';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { UserFilterComponent } from "../user-filter/user-filter.component";
import { HttpParams } from '@angular/common/http';
import { FilterService } from '../../../Services/filter.service';
import { User } from '../../../Models/user';

@Component({
  selector: 'app-user-list',
  imports: [NgFor, RouterLink, UserFilterComponent,],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {

  users!: User[];

  constructor(private filterService: FilterService, private userService: UserServiceService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: Params) => {

      const queryParams: HttpParams = this.filterService.updateQueryParams(params);

      this.fetchUsers(queryParams);

    });
  }

  fetchUsers(queryParams: HttpParams) {

    this.userService.getUsers(queryParams).subscribe((resposne: any) => {

      this.users = resposne.data;

    });
  }

}//
