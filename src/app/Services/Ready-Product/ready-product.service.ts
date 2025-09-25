import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReadyProductService {

  constructor(private apiService: ApiService) { }

  getReadyProducts(queryParams: HttpParams) {
    return this.apiService.get('ready_product', queryParams);
  }

  createReadyProduct(data: any) {
    return this.apiService.post('ready_product', data);
  }

  getReadyProduct(id: any) {
    return this.apiService.get(`ready_product/${id}`);
  }

  updateReadyProduct(id: any, data: any) {
    return this.apiService.update(`ready_product/${id}`, data);
  }

  deleteReadyProduct(id: any) {
    return this.apiService.delete(`ready_product/${id}`);
  }

  getReadyProductByCode(code: any) {
    return this.apiService.get(`ready_product?product_code=${code}`);
  }

  // This method is unused and throws an error, you might want to remove or implement it.
  getById(readyProductId: any) {
    throw new Error('Method not implemented.');
  }

  getPackagingStacks(){
    return this.apiService.get(`products?type_for_packaging_stack=Packaging Stack`);
  }

  // +++ ADD THIS NEW METHOD +++
  getNextCodeByPrefix(prefix: string) {
    const params = new HttpParams().set('prefix', prefix);
    return this.apiService.get('ready-product/get-next-code', params);
  }
  // +++ END OF NEW METHOD +++
}
