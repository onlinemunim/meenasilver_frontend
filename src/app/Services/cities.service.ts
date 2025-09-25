import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {
  private apiUrl = 'http://localhost:9000/api/cities';

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getCities(queryParams: HttpParams) {
    return this.apiService.get('cities', queryParams);
  }

  getCity(id: any) {
    return this.apiService.get('cities/' + id);
  }

  createCity(data: any) {
    return this.apiService.post('cities', data);
  }

  updateCity(id: any, data: any) {
    return this.apiService.update('cities/' + id, data);
  }
  deleteCity(id: any) {
    return this.apiService.delete('cities/' + id);
  }
  getAllCities(): Observable<any[]> {
      return this.http.get<any[]>(this.apiUrl);
  }

  getCitiesByState(stateId: any) {
    const params = new HttpParams().set('state_id', stateId);
    return this.apiService.get('cities', params);
  }
}
