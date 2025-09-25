import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../api.service';


@Injectable({
  providedIn: 'root'
})
export class StockOutService {
  private stockOutIdSubject = new BehaviorSubject<number | null>(null);
  stockOutId$ = this.stockOutIdSubject.asObservable();

  private barcodeSubject = new BehaviorSubject<any>(null);
  private barcode$ = new BehaviorSubject<string | null>(null);

  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient,private apiService: ApiService) {}

  /**
   * Get all Stock Out entries.
   */
  // getStockOutEntries(params?: any): Observable<any> {
  //   return this.http.get(`${this.apiUrl}stock_outs`, { params });
  // }
  getStockOutEntries(queryParams?:HttpParams): Observable<any> {
    return this.apiService.get('stock_outs',queryParams);
  }

  createStockOutEntry(data: any): Observable<any> {
    return this.apiService.post('stock_outs', data);
  }
  /**
   * Set selected Stock Out ID
   */
  setStockOutId(id: number | null): void {
    this.stockOutIdSubject.next(id);
  }

  setBarcode(barcode: string) {
    this.barcode$.next(barcode);
  }

  getBarcode(): Observable<string | null> {
    return this.barcode$.asObservable();
  }

  getInvoiceNumber(id: any): Observable<any> {
    return this.apiService.get(`stock-out/get-invoice-number/${id}`);
  }

  deleteStockOutEntry(id: number): Observable<any> {
    return this.apiService.delete(`stock_outs/${id}`);
  }
}
