import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs'; // Import Subject

@Injectable({
  providedIn: 'root'
})
export class TaggingService {

  // --- NEW: Add a Subject for communication ---
  private tagCreatedSource = new Subject<void>();
  public tagCreated$ = this.tagCreatedSource.asObservable();
  // -------------------------------------------

  constructor(private apiService: ApiService) {}

  // --- NEW: Method to notify listeners ---
  notifyTagCreated() {
    this.tagCreatedSource.next();
  }
  // ---------------------------------------

  // --- No changes to existing methods ---
  getTaggings(queryParams?: HttpParams): Observable<any> {
    return this.apiService.get('stock_details', queryParams);
  }

  getTagging(id: any): Observable<any> {
    return this.apiService.get(`stock_details/${id}`);
  }

  createStockDetails(data: any): Observable<any> {
    return this.apiService.post('stock_details', data);
  }

  deleteTagging(id: any): Observable<any> {
    return this.apiService.delete(`stock_details/${id}`);
  }

  getTaggingsDataOnItemCode(itemCode:any){
    return this.apiService.get(`stock_details?std_item_code=${itemCode}`);
  }

  getStockDetailsByProductType(){
    return this.apiService.get(`stock_details?std_product_type=piece-wise`);
  }
}
