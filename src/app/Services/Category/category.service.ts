import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private apiService: ApiService) { }

  getCategories(params?: HttpParams) {
    return this.apiService.get('categories');
  }

  getCategory(id: any) {
    return this.apiService.get(`categories/${id}`);
  }

  createCategory(data: any) {
    return this.apiService.post('categories', data);
  }

  deleteCategory(id: any) {
    return this.apiService.delete(`categories/${id}`);
  }

  updateCategory(id: any, data: any) {
    return this.apiService.update(`categories/${id}`, data);
  }

  getMrp(categoryNAme:any){
    return this.apiService.get(`categories?name=${categoryNAme}`);
  }
}
