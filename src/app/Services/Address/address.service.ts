import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  getById(addressId: any) {
    throw new Error('Method not implemented.');
  }

  constructor(private apiService:ApiService) { }

  getAddresses(queryParams: HttpParams) {
    return this.apiService.get('addresses', queryParams);
  }

  createAddress(data: any) {
    return this.apiService.post('addresses', data);
  }

  getAddress(id: any) {
    return this.apiService.get(`addresses/${id}`);
  }

  updateAddress(id: any, data: any) {
    return this.apiService.update(`addresses/${id}`, data);
  }

  deleteAddress(id: any) {
    return this.apiService.delete(`addresses/${id}`);
  }

  getAddressDataWithUserType(userType: any,userId:any) {
    return this.apiService.get(`addresses?user_type=${userType}&user_id=${userId}`);
  }

}
