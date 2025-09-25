import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, map } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly baseUrl: string = environment.apiBaseUrl;

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  get apiUrl(): string { return environment.apiBaseUrl; }

  get headers(): HttpHeaders {
    const headerConfing: {} = {
      "Content-Type": "application/json",
      'Accept': 'application/json',
    }

    return new HttpHeaders(headerConfing);
  }

  options: object = { ... this.headers }

  constructor(private httpClient: HttpClient, private notification: NotificationService) { }

  login(body: object) {
    return this.httpClient.post(this.baseUrl + 'login', body, this.options).pipe(
      catchError((errors: HttpErrorResponse) => {

        this.formatError(errors);

        return '';
      }),
      map((res: any) => {
        return res;
      })
    );;
  }

  signup(body: object) {
    return this.httpClient.post(this.baseUrl + 'signup', body, this.options).pipe(
      catchError((errors: HttpErrorResponse) => {

        this.formatError(errors);

        return '';
      }),
      map((res: any) => {
        return res;
      })
    );;
  }

  private formatError(errors: HttpErrorResponse) {

    const errorsData = errors.error.errors;

    Object.entries(errorsData).forEach(([key, value]) => {
      const message = `Field: ${key}, Error: ${value}`
      this.notification.showError(message, 'Validation Error');
    });

  }
  // sendOtpLogin(data: { email: string; mobilenumber: string }): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/auth/send-otp-login`, data);
  // }

  // // Verify OTP
  // verifyOtpLogin(data: { mobilenumber: string; otp: string }): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/auth/verify-otp-login`, data);
  // }

  sendOtpLogin(data: { email:string; mobilenumber: string })
  {
    return this.httpClient.post(`${this.apiUrl}auth/send-otp-login`, data, this.options);
  }

  verifyOtpLogin(data: { mobilenumber: string; otp: string }){
    return this.httpClient.post(`${this.apiUrl}auth/verify-otp-login`, data, this.options);
  }

}
