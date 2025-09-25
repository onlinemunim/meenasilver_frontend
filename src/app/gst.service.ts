import { Injectable } from '@angular/core';
import { ApiService } from './Services/api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GstService {

  constructor(private apiService: ApiService) { }

  getGstDetails(gstnumber: string)
  {
    const params = new HttpParams().set('gst_number', gstnumber);
    const url = 'get-gst-info';
    console.log('Request URL:', `${this.apiService.apiUrl}${url}?gst_number=${gstnumber}`);
    return this.apiService.get(url, params);
  }


}
