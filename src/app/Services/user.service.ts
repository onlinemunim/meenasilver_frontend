import { Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {

  constructor(private apiService: ApiService) { }

  getUsers(queryParams: HttpParams) {

    return this.apiService.get('users', queryParams);
  }

  getUser(id: any)
  {
    return this.apiService.get('users/' + id);
  }

  createUser(data: any) {
    return this.apiService.post('users', data);
  }

  updateUser(id: any, data: any) {
    return this.apiService.update('users/' + id, data);
  }

  // do not continue to use this api call move to country service

  getCountries(params: HttpParams) {
    return this.apiService.get('countries', params);
  }

  getStates(params: HttpParams) {
    return this.apiService.get('states', params);
  }

  getCities(Params: HttpParams){
    return this.apiService.get('cities', Params)
  }

  sendOtp(mobilenumber: string): Observable<any> {
    return this.apiService.post(`users_list/send-otp`, { mobilenumber });
  }

  verifyOtp(otp: string): Observable<any> {
    return this.apiService.post(`users_list/verify-otp`, {
      otp,

    });
  }


}
