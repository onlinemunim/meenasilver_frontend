import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FirmService {
  currentFirmId!: number;
  private apiUrl = environment.apiBaseUrl;

  private firmIdSubject = new BehaviorSubject<number | null>(null);
  firmId$ = this.firmIdSubject.asObservable();

  constructor(private apiService: ApiService, private http: HttpClient) {}

  createFirm(formdata: FormData): Observable<any> {
    return this.apiService.post('firms', formdata);
  }

  getGstNumber(): Observable<any> {
    return this.apiService.get('firms/fetch-gst-no');
  }

  getFirmTypes(): string[] {
    return [
      'Private limited company',
      'Public limited company',
      'One person company',
      'Limited liability (LLP)',
      'Sole proprietorship',
      'Partnership Firm',
      'Company Limited Guaranty',
      'Unlimited Company',
      'Others types of company',
      'Section & company',
      'Subsidiary Company',
    ];
  }

  getFirms() {
    return this.apiService.get('firmsidsnames');
  }

  editFirmsData(id: number, formData: FormData): Observable<any> {
    const headers = { 'X-HTTP-Method-Override': 'PUT' };
    return this.http.post(`${this.apiUrl}firms/${id}`, formData, { headers }); // Use POST and override with PUT
  }

  createPaymentDetails(data: any): Observable<any> {
    return this.apiService.post('payments', data);
  }

  createSmtpDetails(data: any): Observable<any> {
    return this.apiService.post('smpts', data);
  }

  createEInvoiceDetails(data: any): Observable<any> {
    return this.apiService.post('einvoices', data);
  }

  createSocialMediaLinks(data: any): Observable<any> {
    return this.apiService.post('social_media', data);
  }

  getFirmsData() {
    return this.apiService.get('firms');
  }

  getFirm(id: any) {
    return this.apiService.get('firms/' + id);
  }

  getPaymentDetailsByFirmId(firmId: number): Observable<any> {

    return this.apiService.get(`payments?firm_id=${firmId}`);
  }

  getSmtpDetailsByFirmId(firmId: number): Observable<any> {
    return this.apiService.get(`smpts?firm_id=${firmId}`);
  }

  getEInvoiceDetailsByFirmId(firmId: number): Observable<any> {
    return this.apiService.get(`einvoices?firm_id=${firmId}`);
  }

  getSocialMediaLinksByFirmId(firmId: number): Observable<any> {
    return this.apiService.get(`social_media?firm_id=${firmId}`);
  }

  deleteFirm(id: any) {
    return this.apiService.delete('firms/' + id);
  }

  testFileUpload(data: FormData) {
    return this.apiService.post('image-upload', data);
  }

  FileUpload(data: FormData) {
    return this.apiService.post('image-upload', data);
  }


  setFirmId(id: number | null): void {
    if (typeof id === 'number' && id > 0) {
      this.firmIdSubject.next(id);
      localStorage.setItem('firmIdFromGeneral', id.toString());
      console.log('Firm ID set via BehaviorSubject:', id);
    } else {
      this.firmIdSubject.next(null);
      localStorage.removeItem('firmIdFromGeneral');
      console.log('Firm ID cleared in BehaviorSubject and localStorage.');
    }
  }

  getFirmId(): number | null {
    return this.firmIdSubject.getValue();
  }
  getFirmList(): Observable<any> {
    return this.apiService.get('firms');
  }

  // --- UPDATE existing firm sections ---
  updatePaymentDetails(id: number, data: any): Observable<any> {
    return this.apiService.update(`payments/${id}`, data);
  }

  updateSmtpDetails(id: number, data: any): Observable<any> {
    return this.apiService.update(`smpts/${id}`, data);
  }

  updateEInvoiceDetails(id: number, data: any): Observable<any> {
    return this.apiService.update(`einvoices/${id}`, data);
  }

  updateSocialMediaLinks(id: number, data: any): Observable<any> {
    return this.apiService.update(`social_media/${id}`, data);
  }

  private firmsUpdatedSubject = new BehaviorSubject<boolean>(false);
  firmsUpdated$ = this.firmsUpdatedSubject.asObservable();

  notifyFirmsUpdated() {
    this.firmsUpdatedSubject.next(true);
  }
}
