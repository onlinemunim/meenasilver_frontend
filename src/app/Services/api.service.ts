import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Observable, catchError, throwError, map, finalize } from 'rxjs';
import { NotificationService } from './notification.service';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private router: Router,
    private notification: NotificationService,
  ) { }

  get apiUrl(): string { return environment.apiBaseUrl; }

  get headers(): HttpHeaders {
    const headerConfing: {} = {
      'Accept': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }

    return new HttpHeaders(headerConfing);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(`${this.apiUrl}${path}`, { headers: this.headers, params: params }).pipe(
      catchError((errors: HttpErrorResponse) => {

        this.errorHandler(errors);

        return '';
      }),
      map((res: any) => {
        return res;
      }),
      finalize(() => {

      })
    );
  }

  post(path: string, body: FormData | FormGroup | Object, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.post(`${this.apiUrl}${path}`, body, { headers: this.headers, params }).pipe(
      catchError((errors: HttpErrorResponse) => {

        this.errorHandler(errors);

        return '';
      }),
      map((res: any) => {
        return res;
      })
    );
  }

  update(path: string, body: FormData | FormGroup | Object, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.put(`${this.apiUrl}${path}`, body, { headers: this.headers, params }).pipe(
      catchError((errors: HttpErrorResponse) => {

        this.errorHandler(errors);

        return '';
      }),
      map((res: any) => {
        return res;
      })
    );
  }

  delete(path: string, body: Object = {}, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.delete(`${this.apiUrl}${path}`, { headers: this.headers, params }).pipe(
      catchError((errors: HttpErrorResponse) => {

        this.errorHandler(errors);

        return '';
      }),
      map((res: any) => {
        return res;
      })
    );
  }

  private errorHandler(error: HttpErrorResponse) {

    if (error.status === 401) {
      this.notification.showError('Unauthorized', 'Please login to continue');
      this.router.navigate(['/login']);
      localStorage.clear();
    } else if (error.status === 422) {

      this.formatError(error);

    }

  }

  private formatError(errors: HttpErrorResponse) {

    const errorsData = errors.error.errors;

    Object.entries(errorsData).forEach(([key, value]) => {
      const message = `Field: ${key}, Error: ${value}`
      this.notification.showError(message, errors.statusText);
    });

  }
}


