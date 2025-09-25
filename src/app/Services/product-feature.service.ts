import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductFeatureService {

  constructor (private apiService: ApiService ,private http :HttpClient ,private AuthService : AuthService) { }



  createFeature(data: any) {

    return this.apiService.post('productaddfeatures', data);
  }
  getFeaturesList() {
    return this.apiService.get('productaddfeatures');
  }
  getFeatureList(id: any)
  {
    return this.apiService.get('productaddfeatures/' + id);
  }
  deleteFeature(id: any) {
    return this.apiService.delete('productaddfeatures/' + id);
  }

  getFeaturesByProductId(productId: number): Observable<any> {
    return this.apiService.get(`productaddfeatures?product_id=${productId}`);
  }

  updateFeature(id: any, data: any) {
    return this.apiService.update('productaddfeatures/' + id, data);
  }

}
