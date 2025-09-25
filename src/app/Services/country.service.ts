import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

  private apiUrl = 'http://localhost:9000/api/countries';

  constructor(private apiService: ApiService, private http:HttpClient) { }

  getCountries(queryParams: HttpParams) {
    return this.apiService.get('countries', queryParams);
  }

  getCountry(id: any) {
    return this.apiService.get('countries/' + id);
  }
  createCountry(data: any) {
    return this.apiService.post('countries', data);
  }

  updateCountry(id: any, data: any) {
    return this.apiService.update('countries/' + id, data);
  }
  deleteCountry(id: any) {
    return this.apiService.delete('countries/' + id);
  }
  getAllCountries(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
