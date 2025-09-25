import { StatesService } from './../../../../Services/states.service';
import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { StatesFilterComponent } from '../states-filter/states-filter.component';
import { HttpParams } from '@angular/common/http';
import { FilterService } from '../../../../Services/filter.service';
import { User } from '../../../../Models/user';

@Component({
  selector: 'app-states-show',
  imports: [NgFor, RouterLink, StatesFilterComponent,],
  templateUrl: './states-show.component.html',
  styleUrl: './states-show.component.css'
})
export class StatesShowComponent implements OnInit {

  users!: User[];
  states: any;

  constructor(private filterService: FilterService, private statesService: StatesService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: Params) => {

      const queryParams: HttpParams = this.filterService.updateQueryParams(params);

      this.fetchStates(queryParams);

    });
  }

  fetchStates(queryParams: HttpParams) {

    this.statesService.getStates(queryParams).subscribe((resposne: any) => {

      this.states = resposne.data;

    });
  }
    deleteState(event: Event, id: any) {
    event.preventDefault(); // Prevent form submission or default link behavior

    if (confirm("Are you sure you want to delete this State?")) {
      this.statesService.deleteState(id).subscribe(
        (response: any) => {
          console.log(response);
          alert("State deleted successfully!");

          this.states = this.states.filter((state: any) => state.id !== id);
        },
        (error) => {
          console.error("Error deleting state:", error);
          alert("Failed to delete the state. Please try again.");
        }
      );
    }
  }

}

