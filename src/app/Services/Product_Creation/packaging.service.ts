import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PackagingService {

  constructor(private apiService:ApiService, private http:HttpClient) { }

  getPackagings(){
    return this.apiService.get('packagings')
  }

  getPackaging(id:any){
    return this.apiService.get('packagings/'+ id)
  }

  getPackagingListByProductId(productId: number): Observable<any> {
    return this.apiService.get(`packagings?product_id1=${productId}`);
  }

  getPackagingListByProductIdAndWithIncludeInTotalPrice(productId: number){
    return this.apiService.get(`packagings?include_in_total_price=0&product_id=${productId}`);
  }

  createPackaging(data: any) {
    return this.apiService.post('packagings', data);
  }

  updatePackaging(id: any, data: any) {
    return this.apiService.update('packagings/' + id, data);
  }
  deletePackaging(id: any) {
    return this.apiService.delete('packagings/' + id);
  }
}
