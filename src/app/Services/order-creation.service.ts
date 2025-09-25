import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderCreationService {
  private apiUrl = 'order_creation';

  constructor(private apiService: ApiService) {}

  getOrders(queryParams?: HttpParams): Observable<any> {
    return this.apiService.get(this.apiUrl, queryParams);
  }

  getOrder(id: any): Observable<any> {
    return this.apiService.get(`${this.apiUrl}/${id}`);
  }

  createOrder(data: any): Observable<any> {
    return this.apiService.post(this.apiUrl, data);
  }

  updateOrder(id: any, data: any): Observable<any> {
    return this.apiService.update(`${this.apiUrl}/${id}`, data);
  }

  deleteOrder(id: any): Observable<any> {
    return this.apiService.delete(`${this.apiUrl}/${id}`);
  }

  getGeneralProductCodeForProductDesign(queryParams?: HttpParams){
    return this.apiService.get('completed-assembly-codes',queryParams);
  }

  getKalakarSuppliers(): Observable<any> {
    return this.apiService.get('users?suppliertype=kalakar,Karigar');
  }

}
