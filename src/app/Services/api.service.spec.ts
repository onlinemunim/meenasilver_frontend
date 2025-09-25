import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { Router } from '@angular/router';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showError']);
    const routerSpyInstance = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        { provide: NotificationService, useValue: notificationSpy },
        { provide: Router, useValue: routerSpyInstance }
      ]
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no unmatched requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


});
