import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class SharedProductService {
  private productIdSubject = new BehaviorSubject<string | null>(null);

  constructor(private apiService: ApiService){}
  // Observable version to subscribe to
  productId$ = this.productIdSubject.asObservable();

  // Set from component
  setProductId(id: string | null) {
    this.productIdSubject.next(id);
  }

  // Get latest value synchronously
  getProductId():string | null {
    return this.productIdSubject.value;
  }

  //get metal parts by product id
  getMetalsByProductId(productId: number): Observable<any> {
      return this.apiService.get(`assembly_metal_parts?product_id=${productId}`);
  }

  getProductPriceDataForEdit(id:any): Observable<any> {
    return this.apiService.get(`product_prices?product_id=${id}`);
  }
}
