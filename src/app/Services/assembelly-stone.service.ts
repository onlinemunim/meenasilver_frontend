import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AssembellyStoneService {

  constructor(
    private apiService: ApiService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  createStone(data: any) {
    return this.apiService.post('assembly_stones', data);
  }

  getStone(id: any) {
    return this.apiService.get('assembly_stones/' + id);
  }

  getStoneList() {
    return this.apiService.get('assembly_stones');
  }

  deleteStone(id: any) {
    return this.apiService.delete('assembly_stones/' + id);
  }

  updateStone(id: any, data: any) {
    return this.apiService.update('assembly_stones/' + id, data);
  }

  getStonesByProductId(productId: number): Observable<any> {
    return this.apiService.get(`assembly_stones?product_id=${productId}`);
  }
}
