import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserSupplierService {

  constructor(
    private ApiService: ApiService,
    private http: HttpClient,
  ) { }

  createUserSupplier(data: FormData): Observable<any> {
    return this.ApiService.post('user_supplier', data);
  }


  getUserSupplier(queryParams:HttpParams): Observable<any> {
    return this.ApiService.get('user_supplier',queryParams);
  }

  getUserSupplierById(id: any): Observable<any> {
    return this.ApiService.get('user_supplier/' + id);
  }

  updateUserSupplier(id: any, data: FormData): Observable<any> {
    return this.ApiService.post('user_supplier/' + id, data);
  }

  deleteUserSupplier(id: any): Observable<any> {
    return this.ApiService.delete('user_supplier/' + id);
  }

}
