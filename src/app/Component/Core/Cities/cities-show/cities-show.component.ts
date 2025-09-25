import { Component, OnInit } from '@angular/core';
import { CitiesService } from '../../../../Services/cities.service';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CitiesFilterComponent } from '../cities-filter/cities-filter.component';
import { HttpParams } from '@angular/common/http';
import { FilterService } from '../../../../Services/filter.service';
import { User } from '../../../../Models/user';

@Component({
  selector: 'app-cities-show',
  imports: [NgFor, RouterLink, CitiesFilterComponent,],
  templateUrl: './cities-show.component.html',
  styleUrl: './cities-show.component.css'
})
export class CitiesShowComponent implements OnInit {

  users!: User[];
  cities: any;

  constructor(private filterService: FilterService, private citiesService: CitiesService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: Params) => {

      const queryParams: HttpParams = this.filterService.updateQueryParams(params);

      this.fetchCities(queryParams);

    });
  }

  fetchCities(queryParams: HttpParams) {

    this.citiesService.getCities(queryParams).subscribe((resposne: any) => {

      this.cities = resposne.data;

    });
  }
    deleteCity(event: Event, id: any) {
    event.preventDefault(); // Prevent form submission or default link behavior

    if (confirm("Are you sure you want to delete this cities?")) {
      this.citiesService.deleteCity(id).subscribe(
        (response: any) => {
          console.log(response);
          alert("City  deleted successfully!");

          this.cities = this.cities.filter((cities: any) => cities.id !== id);
        },
        (error) => {
          console.error("Error deleting City:", error);
          alert("Failed to delete the City. Please try again.");
        }
      );
    }
  }

}


