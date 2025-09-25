import { Injectable } from '@angular/core';
import { ApiService } from '../../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserStaffService {

  constructor(
    private ApiService: ApiService
  ) { }


  createUserStaff(data: FormData): Observable<any> {

    return this.ApiService.post('user_staff', data);
  }


  getUserStaff(): Observable<any> {
    return this.ApiService.get('user_staff');
  }


  getUserStaffById(id: any): Observable<any> {
    return this.ApiService.get('user_staff/' + id);
  }

  updateUserStaff(id: any, data: FormData): Observable<any> {
    return this.ApiService.post('user_staff/' + id, data);
  }


  deleteUserStaff(id: any): Observable<any> {
    return this.ApiService.delete('user_staff/' + id);
  }

  CreateEmployment(data:FormData)
  {
    return this.ApiService.post('user_staff',data);
  }

  UpdateEmployment(id: any, data: FormData) {
    // --- CHANGE THIS METHOD TO USE POST ---
    // The endpoint remains the same, but the HTTP verb changes.
    return this.ApiService.post('user_staff/' + id, data);
  }
}
