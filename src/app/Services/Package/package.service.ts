import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

  constructor(private apiService: ApiService) { }
  
    getPackages(queryParams: HttpParams) {
      return this.apiService.get('packages', queryParams);
    }
  
    getPackage(id: any) {
      return this.apiService.get('packages/' + id);
    }
  
    createPackage(data: any) {
      return this.apiService.post('packages', data);
    }
  
    updatePackage(id: any, data: any) {
      return this.apiService.update('packages/' + id, data);
    }

    deletePackage(id: any) {
      return this.apiService.delete('packages/' + id);
    }
}
