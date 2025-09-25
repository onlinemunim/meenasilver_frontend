import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class ForgetPasswordService {

  constructor(private apiService: ApiService) { }

  forgotPassword(data:any) {
    return this.apiService.post('forgot-password/owner', data);
  }

  resetPassword(data:any) {
    return this.apiService.post('reset-password/owner', data);
  }

}
