import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInvestorService {

  constructor(
    private ApiService: ApiService,
    private http: HttpClient,
  ) { }

  createUserInvestor(data: FormData): Observable<any> {
    return this.ApiService.post('investors', data);
  }

  getUserInvestor(): Observable<any> {
    return this.ApiService.get('investors');
  }

  getUserInvestorById(id: any): Observable<any> {
    return this.ApiService.get('investors/' + id);
  }

  updateUserInvestor(id: any, data: FormData): Observable<any> {
    return this.ApiService.post('investors/' + id, data);
  }

  deleteUserInvestor(id: any): Observable<any> {
    return this.ApiService.delete('investors/' + id);
  }
}
