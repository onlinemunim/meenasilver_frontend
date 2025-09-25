import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockDetailService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private apiService: ApiService, private http: HttpClient) {}

  getStockDetails(queryParams:HttpParams): Observable<any> {
    return this.apiService.get('stock_details',queryParams);
  }

  getStockDetailById(id: number): Observable<any> {
    return this.apiService.get(`stock_details/${id}`);
  }

  createStockDetail(data: FormData): Observable<any> {
    return this.apiService.post('stock_details', data);
  }

  updateStockDetail(id: number | string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'X-HTTP-Method-Override': 'PUT',
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(`${this.apiUrl}stock_details/${id}`, formData, { headers });
  }

  deleteStockDetail(id: number): Observable<any> {
    return this.apiService.delete(`stock_details/${id}`);
  }
}
