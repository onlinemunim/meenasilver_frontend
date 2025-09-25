import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BankService {

  constructor(private apiServiece:ApiService) { }

  getBanksInfo(params:HttpParams){
    return this.apiServiece.get('banks');
  }

  getBankInfo(id:any){
    return this.apiServiece.get('banks/'+id);
  }

  createBankInfo(data:any){
    return this.apiServiece.post('banks',data);
  }

  deleteBankInfo(id:any){
    return this.apiServiece.delete('banks/'+id)
  }

  updateBankInfo(id:any,data:any){
    return this.apiServiece.update('banks/'+id,data)
  }

  getBankDataWithUserType(userType: any,userId:any) {
    return this.apiServiece.get(`banks?user_type=${userType}&user_id=${userId}`);
  }
}
