import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockInService {
  private stockInIdSubject = new BehaviorSubject<number | null>(null);
  stockInId$ = this.stockInIdSubject.asObservable();

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get all Stock In entries.
   */
  getStockInEntries(params?: HttpParams): Observable<any> {
    return this.http.get(`${this.apiUrl}stock_ins`, { params });
  }
}
