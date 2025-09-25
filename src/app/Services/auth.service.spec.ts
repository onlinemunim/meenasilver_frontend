import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: NotificationService, useValue: notificationSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if user is authenticated', () => {
    localStorage.setItem('token', 'fake-token');
    expect(service.isAuthenticated).toBeTrue();
    localStorage.removeItem('token');
  });

  it('should return false if user is not authenticated', () => {
    localStorage.removeItem('token');
    expect(service.isAuthenticated).toBeFalse();
  });

  it('should perform a successful login', () => {
    const mockResponse = { token: 'fake-token' };
    const testBody = { email: 'user@example.com', password: 'password123' };

    service.login(testBody).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testBody);
    req.flush(mockResponse);
  });

  it('should perform a successful signup', () => {
    const mockResponse = { success: true };
    const testBody = { name: 'John Doe', email: 'user@example.com', password: 'password123' };

    service.signup(testBody).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}signup`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(testBody);
    req.flush(mockResponse);
  });

  it('should handle login validation error (422)', () => {
    const testBody = { email: '', password: '' };
    const mockErrorResponse = new HttpErrorResponse({
      status: 422,
      error: { errors: { email: 'Email is required' } },
      statusText: 'Unprocessable Entity'
    });

    service.login(testBody).subscribe(
      () => fail('Expected 422 error'),
      () => {
        expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Field: email, Error: Email is required', 'Validation Error');
      }
    );

    const req = httpMock.expectOne(`${environment.apiBaseUrl}login`);
    req.flush(mockErrorResponse.error, mockErrorResponse);
  });

  it('should handle signup validation error (422)', () => {
    const testBody = { name: '', email: '', password: '' };
    const mockErrorResponse = new HttpErrorResponse({
      status: 422,
      error: { errors: { name: 'Name is required' } },
      statusText: 'Unprocessable Entity'
    });

    service.signup(testBody).subscribe(
      () => fail('Expected 422 error'),
      () => {
        expect(notificationServiceSpy.showError).toHaveBeenCalledWith('Field: name, Error: Name is required', 'Validation Error');
      }
    );

    const req = httpMock.expectOne(`${environment.apiBaseUrl}signup`);
    req.flush(mockErrorResponse.error, mockErrorResponse);
  });
});
