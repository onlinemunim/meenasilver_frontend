import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OwnerService {

  constructor(private apiService:ApiService) { }

  getOwners(queryParams: HttpParams){
    return this.apiService.get('owners', queryParams)
  }

  createOwner(data: any) {
    return this.apiService.post('owners', data);
  }

  getOwner(id: any) {
    return this.apiService.get('owners/' + id);
  }

  updateOwner(id: any, data: any) {
    return this.apiService.update('owners/' + id, data);
  }

  deleteOwner(id: any){
    return this.apiService.delete('owners/'+id)
  }
}
