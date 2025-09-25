import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserCustomerService {

  constructor(
    private ApiService: ApiService,
    private http: HttpClient,
  ) { }

  createUserCustomer(data: FormData): Observable<any> {
    return this.ApiService.post('users_list', data);
  }

  getUserCustomers(queryParams: HttpParams): Observable<any> {
    return this.ApiService.get('users_list',queryParams);
  }

  getUserCustomerById(id: any): Observable<any> {
    return this.ApiService.get(`users_list/${id}`);
  }

  updateUserCustomer(id: any, data: FormData): Observable<any> {
    return this.ApiService.post(`users_list/${id}`, data);
  }

  deleteUserCustomer(id: any): Observable<any> {
    return this.ApiService.delete(`users_list/${id}`);
  }
  getCustomerDetails(id: any): Observable<any> {
    return this.ApiService.get(`customers/${id}`);
  }
}
