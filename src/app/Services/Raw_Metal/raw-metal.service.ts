import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RawMetalService {
  private rawMetalEntryIdSubject = new BehaviorSubject<number | null>(null);
  rawMetalEntryId$ = this.rawMetalEntryIdSubject.asObservable();

  private apiUrl = environment.apiBaseUrl;
  private createdRawMetalEntry: any = null;

  constructor(private apiService: ApiService, private http: HttpClient) { }

  /**
   * Fetches all raw metal entries (now referred to as 'stocks').
   * @returns Observable<any>
   */
  getRawMetalEntries(): Observable<any> {
    return this.apiService.get('stocks'); // API endpoint changed
  }

  getReadyProductItemCodes(): Observable<any> {
    return this.apiService.get(`ready_product`);
  }

  getReadyProductByType(query:any): Observable<any> {
    return this.apiService.get(`ready_product?ready_product_type=${query}`);
  }


  /**
   * Creates a new stock entry.
   * Note: The `data` parameter here is FormData, and the field names within it
   * are expected to already be the 'st_' prefixed names from the component.
   * @param data The FormData containing the data for the new stock entry.
   * @returns Observable<any>
   */
  createRawMetalEntry(data: FormData): Observable<any> {
    return this.apiService.post('stocks', data); // API endpoint changed
  }

  /**
   * Sets the ID of the currently selected stock entry.
   * @param id The ID of the stock entry.
   */
  setRawMetalEntryId(id: number): void {
    this.rawMetalEntryIdSubject.next(id);
  }

  /**
   * Gets the ID of the currently selected stock entry.
   * @returns number | null
   */
  getRawMetalEntryId(): number | null {
    return this.rawMetalEntryIdSubject.getValue();
  }

  /**
   * Deletes a stock entry by its ID.
   * @param id The ID of the stock entry to delete.
   * @returns Observable<any>
   */
  deleteRawMetalEntry(id: any): Observable<any> {
    return this.apiService.delete('stocks/' + id); // API endpoint changed
  }

  /**
   * Fetches a stock entry by its ID.
   * @param id The ID of the stock entry to fetch.
   * @returns Observable<any>
   */
  getRawMetalEntryById(id: any): Observable<any> {
    return this.apiService.get('stocks/' + id); // API endpoint changed
  }

  /**
   * Updates an existing stock entry.
   * Uses POST with X-HTTP-Method-Override: PUT for FormData.
   * @param id The ID of the stock entry to update.
   * @param formData The FormData containing the updated stock entry data.
   * @returns Observable<any>
   */
  updateRawMetalEntry(id: string | number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'X-HTTP-Method-Override': 'PUT',
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(`${this.apiUrl}stocks/${id}`, formData, { headers }); // API endpoint changed
  }

  /**
   * Sets a created stock entry.
   * @param entry The created stock entry object.
   */
  setCreatedRawMetalEntry(entry: any): void {
    this.createdRawMetalEntry = entry;
  }

  /**
   * Gets the last created stock entry.
   * @returns any
   */
  getCreatedRawMetalEntry(): any {
    return this.createdRawMetalEntry;
  }

  // --- Specific search/add methods for Stock Entries ---

  /**
   * Searches stock entries by 'st_metal_type'.
   * @param query The metal type to search for.
   * @returns Observable<any>
   */
  searchMetals(query: string): Observable<any> {
    // API endpoint changed, and parameter name changed
    return this.apiService.get(`stocks?st_metal_type=${query}`);
  }

  /**
   * Searches stock entries by 'st_name'.
   * @param query The name to search for.
   * @returns Observable<any>
   */
  searchNames(query: string): Observable<any> {
    // API endpoint changed, and parameter name changed
    return this.apiService.get(`stocks?st_name=${query}`);
  }

  /**
   * Searches stock entries by 'st_code'.
   * @param query The code to search for.
   * @returns Observable<any>
   */
  searchCodes(query: string): Observable<any> {
    // API endpoint changed, and parameter name changed
    return this.apiService.get(`stocks?st_code=${query}`);
  }

  // Example: if you need to fetch unique metal types from the backend
  getUniqueMetalTypes(): Observable<any> {
    // Assuming you have an endpoint like /api/stocks/unique-metals
    return this.apiService.get('stocks/unique-metals'); // API endpoint changed
  }

  // Example: if you need to fetch unique sizes
  getUniqueSizes(): Observable<any> {
    return this.apiService.get('stocks/unique-sizes'); // API endpoint changed
  }

  //product code filters
  searchByUniqueCodeSku(code: string): Observable<any> {
    return this.apiService.get(`products?unique_code_prefix=${code}`);
  }

  searchByStCode(code: string): Observable<any> {
    // return this.apiService.get(`stocks?st_code=${code}`);
    return this.apiService.get(`ready_product?product_code=${code}`);
  }

  //for filter raw stone related data only
  getStockData(queryParams:HttpParams): Observable<any> {
    return this.apiService.get(`stocks`,queryParams);
  }

  //to patch already present data into raw metal form from stocks
  get_Metal_Data_By_Product_Code_And_Product_Code_Type(code: string): Observable<any> {
    return this.apiService.get(`stocks?st_code_type=raw_metal&exact_st_code=${code}`);
  }

  //to patch already present data into raw stone form from stocks
  get_Stone_Data_By_Product_Code_And_Product_Code_Type(code: string): Observable<any> {
    return this.apiService.get(`stocks?st_code_type=raw_stone&exact_st_code=${code}`);
  }

    updateRawStoneEntry(id: string | number, formData: FormData): Observable<any> {
      const token = localStorage.getItem('token');
      const headers = {
        'X-HTTP-Method-Override': 'PUT',
        Authorization: `Bearer ${token}`,
      };
      return this.http.post(`${this.apiUrl}stocks/${id}`, formData, { headers }); // API endpoint changed
    }
}
