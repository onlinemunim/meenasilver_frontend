import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class StockGeneralService {
  static setProductId(setProductId: any) {
    throw new Error('Method not implemented.');
  }
  private productIdSubject = new BehaviorSubject<number | null>(null);
  productId$ = this.productIdSubject.asObservable();
  private apiUrl = environment.apiBaseUrl;
  private createdProduct: any = null;

  constructor(private apiService: ApiService, private http: HttpClient) {}


  getProducts(queryParams:HttpParams) {
    return this.apiService.get('products',queryParams);
  }

  createProducts(data: any) {
    return this.apiService.post('products', data);
  }

  setProductId(id: number): void {
    this.productIdSubject.next(id);
  }

  getProductId(): number | null {
    return this.productIdSubject.getValue();
  }


  deleteProduct(id: any){
    return this.apiService.delete('products/'+id);
  }


  getProductById(id:any){
    return this.apiService.get('products/'+id);
  }

  updateProduct(id: string | number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = {
      'X-HTTP-Method-Override': 'PUT',
      Authorization: `Bearer ${token}`,
    };
    return this.http.post(`${this.apiUrl}products/${id}`, formData, { headers });
  }

  editProduct(id:any,data:any){
    return this.apiService.update('products/'+id,data);
  }

    //Get Category and sub category here
    getCategories(params: HttpParams){
      return this.apiService.get('categories');
    }

    getCategory(id:any){
      return this.apiService.get('categories/'+id);
    }

    getSubCategories(params: HttpParams){
      return this.apiService.get('sub_categories', params);
    }

    // Method to set the product

    setCreatedProduct(product: any) {
      this.createdProduct = product;
    }

    // Method to get the product
    getCreatedProduct() {
      return this.createdProduct;
    }

    // stock-general.service.ts
    searchTypes(query: string): Observable<any> {
      return this.apiService.get(`products?product_code_type=general&type=${query}`);
    }

    addType(data: { type: string }): Observable<any> {
      return this.apiService.post('products', data);
    }

    createCategory(data: { name: string }) {
      return this.apiService.post('categories', data);
    }

    createSubCategory(payload: any) {
      return this.apiService.post('sub_categories', payload);
    }

    //add metal types
    addMetalType(data: { type?: string; metal_type?: string }): Observable<any> {
      return this.apiService.post('products', data);
    }

    searchMetalTypes(query: string): Observable<any> {
      return this.apiService.get(`products?product_code_type=general&metal_type=${query}`);
    }

    //Clarity
    addClarity(data: { clarity: string }): Observable<any> {
      return this.apiService.post('products', data); // adjust endpoint as needed
    }

    searchClarities(query: string): Observable<any> {
      return this.apiService.get(`products?clarity=${query}`); // adjust endpoint as needed
    }

    searchGroups(search: string) {
      return this.apiService.get(`products?group=${search}`);
    }

    createGroup(payload: { group: string }) {
      return this.apiService.post('products', payload);
    }

    getGroupRelatedData(group: string) {
      return this.apiService.get(`products?group=${group}&exact=1`);
    }

    // Get categories filtered by group name
    getCategoriesByGroup(groupName: string) {
      return this.apiService.get(`categories?group_name=${groupName}`);
    }

    getMetalProductCodes() {
      return this.apiService.get(`products?product_code_type[]=raw_metal&product_code_type[]=general&type!=Packaging`);
    }

    getStoneProductCodes() {
      return this.apiService.get(`products?product_code_type=raw_stone&product_code_type=general&type=!Packaging`);
    }

    getPackagingProductCodes() {
      return this.apiService.get(`products?product_code_type[]=general&product_code_type[]=packaging&type=Packaging`);
    }

    getGeneralProductListOnly(){
      return this.apiService.get(`products?product_code_type=general`);
    }

    getGeneralProductCodeForProductDesign(){
      return this.apiService.get('completed-assembly-codes');
    }

  getProductImageByCode(code: string): Observable<any> {
    return this.apiService.get(`products/image/${code}`);
  }

}
