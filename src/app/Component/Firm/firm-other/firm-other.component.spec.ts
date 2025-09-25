import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FirmOtherComponent } from './firm-other.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError, BehaviorSubject } from 'rxjs';
import { FirmService } from '../../../Services/firm.service';
import { NotificationService } from '../../../Services/notification.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('FirmOtherComponent', () => {
  let component: FirmOtherComponent;
  let fixture: ComponentFixture<FirmOtherComponent>;
  let mockFirmService: any;
  let mockNotificationService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockFirmService = {
      firmId$: new BehaviorSubject<number>(1),
      createPaymentDetails: jasmine.createSpy().and.returnValue(of({})),
      createSmtpDetails: jasmine.createSpy().and.returnValue(of({})),
      createEInvoiceDetails: jasmine.createSpy().and.returnValue(of({})),
      createSocialMediaLinks: jasmine.createSpy().and.returnValue(of({}))
    };

    mockNotificationService = {
      showSuccess: jasmine.createSpy(),
      showError: jasmine.createSpy()
    };

    mockRouter = {
      navigate: jasmine.createSpy()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [],
      providers: [
        { provide: FirmService, useValue: mockFirmService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} }, provideHttpClient(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FirmOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component and init form with firm ID', () => {
    expect(component).toBeTruthy();
    expect(component.mainForm).toBeTruthy();
    expect(component.mainForm.get('paymentDetails.firm_id')?.value).toBe(1);
  });

  it('should show validation error if form is invalid on submit', () => {
    component.mainForm.get('paymentDetails.bank_details')?.setValue('');
    component.onSubmit();
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Please fill all required fields.',
      'Validation Error'
    );
  });

  it('should submit form and show success notification', fakeAsync(() => {

    component.mainForm.patchValue({
      paymentDetails: {
        bank_details: 'ABC Bank',
        bank_account_no: '1234567890',
        bank_ifsc_code: 'IFSC0001234',
        declaration: 'Test',
        aggrid: 'GID123',
        aggrid_name: 'AgGrid Test',
        user_id: '1',
        urn: 'URN123',
        api_key: 'APIKEY123',
        corpid: 'CORP123',
        alias_id: 'ALIAS123',
        firm_id: 1
      },
      smtpDetails: {
        email_id: 'test@example.com',
        email_id_cc: 'cc@example.com',
        server: 'smtp.example.com',
        email_password: 'password123',
        email_id_bcc: 'bcc@example.com',
        port: 587,
        firm_id: 1
      },
      eInvoiceDetails: {
        api_id: 'API001',
        username: 'user',
        api_key: 'apikey',
        password: 'pass',
        firm_id: 1
      },
      socialLinks: {
        whatsapp_link: 'https://wa.me/1234567890',
        instagram_link: 'https://instagram.com/test',
        facebook_link: 'https://facebook.com/test',
        firm_id: 1
      }
    });

    component.onSubmit();
    tick();

    expect(mockFirmService.createPaymentDetails).toHaveBeenCalled();
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
      'Firm sections saved successfully!',
      'Success'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/firms']);
  }));

  it('should handle forkJoin error and show error notification', fakeAsync(() => {
    mockFirmService.createPaymentDetails.and.returnValue(throwError(() => new Error('Network error')));


    component.mainForm.patchValue({
      paymentDetails: {
        bank_details: 'ABC Bank',
        bank_account_no: '1234567890',
        bank_ifsc_code: 'IFSC0001234',
        declaration: 'Test',
        aggrid: 'GID123',
        aggrid_name: 'AgGrid Test',
        user_id: '1',
        urn: 'URN123',
        api_key: 'APIKEY123',
        corpid: 'CORP123',
        alias_id: 'ALIAS123',
        firm_id: 1
      },
      smtpDetails: {
        email_id: 'test@example.com',
        email_id_cc: 'cc@example.com',
        server: 'smtp.example.com',
        email_password: 'password123',
        email_id_bcc: 'bcc@example.com',
        port: 587,
        firm_id: 1
      },
      eInvoiceDetails: {
        api_id: 'API001',
        username: 'user',
        api_key: 'apikey',
        password: 'pass',
        firm_id: 1
      },
      socialLinks: {
        whatsapp_link: 'https://wa.me/1234567890',
        instagram_link: 'https://instagram.com/test',
        facebook_link: 'https://facebook.com/test',
        firm_id: 1
      }
    });

    component.onSubmit();
    tick();

    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Failed to save firm sections. Please try again.',
      'Submission Error'
    );
  }));
});
