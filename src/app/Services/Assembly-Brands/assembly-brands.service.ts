import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssemblyBrandsService {

  constructor(private apiService: ApiService) { }

  getAssemblyBrands(params?: HttpParams) {
    return this.apiService.get('assembly-brands', params);
  }

  getAssemblyBrand(id: any) {
    return this.apiService.get('assembly-brands/' + id);
  }

  createAssemblyBrand(data: any) {
    return this.apiService.post('assembly-brands', data);
  }

  deleteAssemblyBrand(id: any) {
    return this.apiService.delete('assembly-brands/' + id);
  }

  updateAssemblyBrand(id: any, data: any) {
    return this.apiService.update('assembly-brands/' + id, data);
  }
}
