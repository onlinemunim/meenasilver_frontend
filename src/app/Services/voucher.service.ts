import { Injectable } from '@angular/core';
import { HttpClient, HttpParams ,HttpHeaders } from '@angular/common/http';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {



  constructor(private apiService: ApiService)
   {
   }
   createVoucher(data:any)
   {
    return this.apiService.post('vouchers',data)

   }

   getVouchers(queryParams:HttpParams)
   {

    return this.apiService.get('vouchers',queryParams);

   }

   getVoucher(id:any)
   {

    return this.apiService.get('vouchers/'+id);

   }

   updateVoucher(id: any, data: any)
   {

    return this.apiService.update('vouchers/'+id,data);
   }

   deleteVoucher(id:any)
   {

    return this.apiService.delete('vouchers/'+id);
   }




}
