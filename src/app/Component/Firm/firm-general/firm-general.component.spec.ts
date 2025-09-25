import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FirmGeneralComponent } from './firm-general.component';
import { FirmService } from '../../../Services/firm.service';
import { NotificationService } from '../../../Services/notification.service';
import { GstService } from '../../../gst.service';
import { UserServiceService } from '../../../Services/user.service';
import {
  HttpClient,
  HttpParams,
  provideHttpClient,
} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../Services/api.service';
import { Cities } from '../../../Models/Cities';
import { Country } from '../../../Models/country';
import { States } from '../../../Models/States';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('FirmGeneralComponent', () => {
  let component: FirmGeneralComponent;
  let fixture: ComponentFixture<FirmGeneralComponent>;
  let formBuilder: FormBuilder;
  let firmService: jasmine.SpyObj<FirmService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let gstService: jasmine.SpyObj<GstService>;
  let userService: jasmine.SpyObj<UserServiceService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const firmServiceSpy = jasmine.createSpyObj('FirmService', [
      'getFirmTypes',
      'createFirm',
      'setCurrentFirmId',
    ]);
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);
    const gstServiceSpy = jasmine.createSpyObj('GstService', ['getGstDetails']);
    const userServiceSpy = jasmine.createSpyObj('UserServiceService', [
      'getCountries',
      'getStates',
      'getCities',
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post']);

    await TestBed.configureTestingModule({
      imports: [
        FirmGeneralComponent,
        ReactiveFormsModule,
        CommonModule,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        FormBuilder,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: FirmService, useValue: firmServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: GstService, useValue: gstServiceSpy },
        { provide: UserServiceService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
        provideRouter([]),
        provideAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FirmGeneralComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    firmService = TestBed.inject(FirmService) as jasmine.SpyObj<FirmService>;
    notificationService = TestBed.inject(
      NotificationService
    ) as jasmine.SpyObj<NotificationService>;
    gstService = TestBed.inject(GstService) as jasmine.SpyObj<GstService>;
    userService = TestBed.inject(
      UserServiceService
    ) as jasmine.SpyObj<UserServiceService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    firmService.getFirmTypes.and.returnValue([
      'Type A',
      'Type B',
      'Type C',
      'Type D',
    ]);
    userService.getCountries.and.returnValue(
      of({
        data: [
          { id: 1, name: 'India' },
          { id: 2, name: 'USA' },
        ],
      })
    );
    userService.getStates.and.returnValue(
      of({ data: [{ id: 101, name: 'Maharashtra' }] })
    );
    userService.getCities.and.returnValue(
      of({ data: [{ id: 1001, name: 'Pune' }] })
    );
    firmService.createFirm.and.returnValue(of({ success: true }));

    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize form with required controls', () => {
    expect(component.firmForm.contains('gst_no')).toBeTrue();
    expect(component.firmForm.contains('firm_shortid')).toBeTrue();
    expect(component.firmForm.contains('category')).toBeTrue();
    expect(component.firmForm.contains('type')).toBeTrue();
    expect(component.firmForm.contains('gst_status')).toBeTrue();
    expect(component.firmForm.contains('name')).toBeTrue();
    expect(component.firmForm.contains('fin_year_start_date')).toBeTrue();
  });
  it('should fetch countries on initialization', fakeAsync(() => {
    component.ngOnInit();
    tick();
    expect(userService.getCountries).toHaveBeenCalled();
    expect(component.countries.length).toBe(2);
  }));
  it('should fetch firm types on initialization', () => {
    component.ngOnInit();
    expect(firmService.getFirmTypes).toHaveBeenCalled();
    expect(component.firmTypes.length).toBe(4);
  });
  describe('fetchStates', () => {
    it('should fetch states for a country', fakeAsync(() => {
      component.fetchStates(1);
      tick();
      expect(userService.getStates).toHaveBeenCalled();
      expect(component.states.length).toBe(1);
      expect(component.firmForm.controls['state_id'].value).toBe('');
      expect(component.firmForm.controls['city_id'].value).toBe('');
    }));
  });
  it('should call callback function if provided', fakeAsync(() => {
    const callback = jasmine.createSpy('callback');
    component.fetchStates(1, callback);
    tick();
    expect(callback).toHaveBeenCalled();
  }));

  describe('onCountryChange', () => {
    it('should call fetchStates when country is selected', () => {
      spyOn(component, 'fetchStates');
      component.firmForm.controls['country_id'].setValue(1);
      component.onCountryChange();
      expect(component.fetchStates).toHaveBeenCalledWith(1);
    });
  });
  it('should not call fetchStates when country is not selected', () => {
    spyOn(component, 'fetchStates');
    component.firmForm.controls['country_id'].setValue('');
    component.onCountryChange();
    expect(component.fetchStates).not.toHaveBeenCalled();
  });
  describe('onStateChange', () => {
    it('should call fetchCities when state is selected', () => {
      spyOn(component, 'fetchCities');
      component.firmForm.controls['state_id'].setValue(1);
      component.onStateChange();
      expect(component.fetchCities).toHaveBeenCalledWith(1);
    });
    it('should not call fetchCities when state is not selected', () => {
      spyOn(component, 'fetchCities');
      component.firmForm.controls['state_id'].setValue('');
      component.onStateChange();
      expect(component.fetchCities).not.toHaveBeenCalled();
    });
  });
  describe('patchData', () => {
    it('should show error when GST number is empty', () => {
      component.firmForm.controls['gst_no'].setValue('');
      component.patchData();
      expect(notificationService.showError).toHaveBeenCalledWith(
        'Please enter a valid GST number',
        'Error'
      );
    });
  });
});
