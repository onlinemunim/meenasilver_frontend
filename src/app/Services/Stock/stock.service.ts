import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private apiService: ApiService, private http: HttpClient) { }

  getStockEntries(p0?: unknown): Observable<any> {
    return this.apiService.get('stocks');
  }

  getStockEntriesWithParams(queryParams: HttpParams): Observable<any> {
    return this.apiService.get('stocks',  queryParams );
  }

  getStockEntryById(id: number): Observable<any> {
    return this.apiService.get(`stocks/${id}`);
  }

  createStockEntry(data: FormData): Observable<any> {
    return this.apiService.post('stocks', data);
  }

  updateStockEntry(id: number | string, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'X-HTTP-Method-Override': 'PUT',
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(`${this.apiUrl}stocks/${id}`, formData, { headers });
  }

  deleteStockEntry(id: number): Observable<any> {
    return this.apiService.delete(`stocks/${id}`);
  }

  //FILTER RETAIL STOCK LIST ONLY
  getRetailStockOnly(){
    return this.apiService.get(`stocks?st_type_retail=retail`);
  }

  getPackagingProductCode(){
    return this.apiService.get(`stocks?product_code_type=packaging`);
  }

  getSingleDataByProductCode(data: string): Observable<any> {
    return this.apiService.get(`stocks?exact_st_code=${data}`);
  }

  getPackagingByProductId(productId: number): Observable<any> {
    return this.apiService.get(`packaging?product_id=${productId}`);
  }

  getMajorOrMinorDataByType(type: string): Observable<any> {
    return this.apiService.get(`stocks?st_type_retail=${type}`);
  }

  getDatawithItemCode(itemCode: string): Observable<any> {
    return this.apiService.get(`stock_details?item_code=${itemCode}`);
  }

  getDatawithBarcode(itemCode: string): Observable<any> {
    return this.apiService.get(`stock_details?std_barcode=${itemCode}`);
  }

  getAllTags(): Observable<any> {
    return this.apiService.get(`stock_details`);
  }

  getBarcodeDataWithBarcodeOrModelNo(code: any): Observable<any> {
    return this.apiService.get(`stock_details?exact_search=${code}`);
  }
}
