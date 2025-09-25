import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  private apiUrl = 'http://localhost:9000/api/states';

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getStates(queryParams: HttpParams) {
    return this.apiService.get('states', queryParams);
  }

  getState(id: any) {
    return this.apiService.get('states/' + id);
  }

  createState(data: any) {
    return this.apiService.post('states', data);
  }

  updateState(id: any, data: any) {
    return this.apiService.update('states/' + id, data);
  }
  deleteState(id: any) {
    return this.apiService.delete('states/' + id);
  }
  getAllStates(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
