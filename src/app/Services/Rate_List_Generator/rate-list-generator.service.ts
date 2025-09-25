import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiService } from './../api.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RateListGeneratorService {


  constructor(
    private ApiService: ApiService,
    private http: HttpClient,
  ) { }

  createRateList(data: any) {
    return this.ApiService.post('rate_list_generator', data);
  }

  getRateList(queryParams?: HttpParams): Observable<any> {
    return this.ApiService.get('rate_list_generator', queryParams || new HttpParams());
  }

  getRateListById(id: any) {
    return this.ApiService.get('rate_list_generator/' + id);
  }

  updateRateList(id: any, data: any) {
    return this.ApiService.update('rate_list_generator/' + id, data);
  }

  deleteRateList(id: any) {
    return this.ApiService.delete('rate_list_generator/' + id);
  }

}
