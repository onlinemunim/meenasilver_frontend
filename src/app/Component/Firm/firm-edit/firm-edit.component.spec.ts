import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { FirmEditComponent } from './firm-edit.component';
import { provideRouter } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { UserServiceService } from '../../../Services/user.service';
import { of, throwError } from 'rxjs';
import { NotificationService } from '../../../Services/notification.service';
import { GstService } from '../../../gst.service';

describe('FirmEditComponent', () => {
  let component: FirmEditComponent;
  let fixture: ComponentFixture<FirmEditComponent>;
  let userServiceSpy: jasmine.SpyObj<UserServiceService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let gstServiceSpy: jasmine.SpyObj<GstService>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserServiceService', [
      'getCountries',
      'getStates',
      'getCities',
    ]);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showError',
      'showSuccess',
    ]);
    gstServiceSpy = jasmine.createSpyObj('GstService', ['getGstDetails']);

    await TestBed.configureTestingModule({
      imports: [FirmEditComponent, ReactiveFormsModule, ToastrModule.forRoot()],
      providers: [
        FormBuilder,
        provideHttpClient(),
        provideRouter([]),
        { provide: UserServiceService, useValue: userServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: GstService, useValue: gstServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirmEditComponent);
    component = fixture.componentInstance;
    userServiceSpy.getCountries.and.returnValue(of({ data: [] }));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.firmForm).toBeTruthy();
  });

  it('should reset the form', () => {
    spyOn(component.firmForm, 'reset');
    component.clearForm();
    expect(component.firmForm.reset).toHaveBeenCalled();
  });

  it('should handle error in fetchCountries', () => {
    userServiceSpy.getCountries.and.returnValue(
      throwError(() => new Error('Error'))
    );
    component.fetchCountries();
  });

  it('should call fetchStates on country change', () => {
    component.firmForm.controls['country_id'].setValue(1);
    spyOn(component, 'fetchStates');
    component.onCountryChange();
    expect(component.fetchStates).toHaveBeenCalledWith(1);
  });

  it('should fetch countries', () => {
    const mockResponse = { data: [{ id: 1, name: 'Country1' }] };
    userServiceSpy.getCountries.and.returnValue(of(mockResponse));

    component.fetchCountries();

    expect(component.countries.length).toBe(1);
  });

  it('should patch GST data on success', () => {
    const mockGstData = {
      success: true,
      data: {
        gstnumber: '12A',
        name: 'Test Firm',
        country: 1,
        state: 1,
        city: 'City1',
      },
    };
    gstServiceSpy.getGstDetails.and.returnValue(of(mockGstData));
    spyOn(component, 'fetchStates').and.callFake((_, cb) => cb());
    spyOn(component, 'patchFormData');
    component.firmForm.controls['gst_no'].setValue('12A');
    component.patchData();
    expect(component.patchFormData).toHaveBeenCalledWith(mockGstData);
    expect(notificationServiceSpy.showSuccess).toHaveBeenCalled();
  });

  it('should show error if GST number is missing', () => {
    component.firmForm.controls['gst_no'].setValue('');
    component.patchData();
    expect(notificationServiceSpy.showError).toHaveBeenCalled();
  });
});
