import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../../../Services/country.service';
import { NgFor } from '@angular/common';
import { ActivatedRoute, Params, RouterLink } from '@angular/router';
import { CountryFilterComponent } from '../country-filter/country-filter.component';
import { HttpParams } from '@angular/common/http';
import { FilterService } from '../../../../Services/filter.service';
import { User } from '../../../../Models/user';

@Component({
  selector: 'app-user-list',
  imports: [NgFor, RouterLink, CountryFilterComponent,],
  templateUrl: './country-show.component.html',
  styleUrl: './country-show.component.css'
})
export class CountryShowComponent implements OnInit {

  users!: User[];
  countries: any;

  constructor(private filterService: FilterService, private countryService: CountryService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params: Params) => {

      const queryParams: HttpParams = this.filterService.updateQueryParams(params);

      this.fetchCountries(queryParams);

    });
  }

  fetchCountries(queryParams: HttpParams) {

    this.countryService.getCountries(queryParams).subscribe((resposne: any) => {

      this.countries = resposne.data;

    });
  }
    deleteCountry(event: Event, id: any) {
    event.preventDefault(); // Prevent form submission or default link behavior

    if (confirm("Are you sure you want to delete this country?")) {
      this.countryService.deleteCountry(id).subscribe(
        (response: any) => {
          console.log(response);
          alert("Country deleted successfully!");

          this.countries = this.countries.filter((country: any) => country.id !== id);
        },
        (error) => {
          console.error("Error deleting country:", error);
          alert("Failed to delete the country. Please try again.");
        }
      );
    }
  }

}
