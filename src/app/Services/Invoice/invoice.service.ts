import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private apiService: ApiService) { }

  getInvoices(queryParams: HttpParams) {
    return this.apiService.get('invoices', queryParams);
  }

  createInvoice(data: any) {
    return this.apiService.post('invoices', data);
  }

  getInvoice(id: any) {
    return this.apiService.get('invoices/' + id);
  }

  updateInvoice(id: any, data: any) {
    return this.apiService.update('invoices/' + id, data);
  }

  deleteInvoice(id: any) {
    return this.apiService.delete('invoices/' + id);
  }
}
