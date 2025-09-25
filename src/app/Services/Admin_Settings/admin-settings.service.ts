import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminSettingsService {

  constructor(private apiService: ApiService) { }

  getAdminSettings() {
    return this.apiService.get('admin-settings');
  }

  createAdminSettings(data: any) {
    return this.apiService.post('admin-settings', data);
  }
}
