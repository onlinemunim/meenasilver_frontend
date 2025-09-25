import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import{ HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private apiService: ApiService, private http: HttpClient,private AuthService: AuthService) { }


   getCategoryTypes(): string[] {
     return ['+ Add Other','Round', 'Square', 'Rectangle', 'Triangle', 'Oval', 'Hexagon', 'Octagon'];
   }
   getMetalTypes():string[]
   {
    return [
      'Gold',
      'Silver',
      'Stone',
      'Imitation',
    ];
  }

  getUnitTypes(): string[] {
    return [
      'GM',
      'KG',
      'MG',
      'CT',
    ];
  }
  getArticleTypes(): string[] {
    return [
      'Ring',
      'Necklace',
      'Bracelet',
      'Earrings',
      'Star',
      'Heart',
    ];
  }
  getUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id ?? null;
  }
  getCategoryType() {
    return this.apiService.get('assembly_stones');
  }
  getStoneList(id: any){
    return this.apiService.get('assembly_stones');
  }
  getStonesList(id: any) {
    return this.apiService.get('assembly_stones/' + id);
  }
  CreateStone(data: any) {
    return this.apiService.post('assembly_stones', data);
  }
  deleteStone(id: any) {
    return this.apiService.delete('assembly_stones/' + id);
  }
  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '';
  }
  getStonesByProductId(productId: number): Observable<any> {
        return this.apiService.get(`assembly_stones?product_id=${productId}`);
      }

  updateStone(id: any, data: any) {
    return this.apiService.update('assembly_stones/' + id, data);
  }

}
