import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class MetalService {

  constructor(private apiService: ApiService, private http: HttpClient,private AuthService: AuthService) { }

  getMetalTypes():string[]
  {
   return [
    '+ Add Other',
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

  getArticleTypes(){
    return this.apiService.get('assembly_metal_parts');
  }


  CreateMetal(data:any)
  {
   return this.apiService.post('assembly_metal_parts',data);
  }

  getMetalsList(id: any) {
  return this.apiService.get('assembly_metal_parts/'+ id);
  }
  getMetalList() {
    return this.apiService.get('assembly_metal_parts');
    }
  deleteMetal(id: any) {
    return this.apiService.delete('assembly_metal_parts/' + id);
  }
  updateMetal(id: any, data: any) {
    return this.apiService.update('assembly_metal_parts/' + id, data);
  }

   getMetalsByProductId(productId: number): Observable<any> {
      return this.apiService.get(`assembly_metal_parts?product_id=${productId}`);
    }
}
