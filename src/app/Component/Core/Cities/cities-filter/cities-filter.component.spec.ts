import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CitiesFilterComponent } from './cities-filter.component';
import { CountryService } from '../../../../Services/country.service';
import { ApiService } from '../../../../Services/api.service';
import { NotificationService } from '../../../../Services/notification.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('CitiesFilterComponent', () => {
  let component: CitiesFilterComponent;
  let fixture: ComponentFixture<CitiesFilterComponent>;

  const mockCountries = { data: ['India', 'USA'] };
  const mockStates = { data: ['Gujarat', 'California'] };
  const mockCities = { data: ['Ahmedabad', 'Los Angeles'] };

  const countryServiceMock = {
    getAllCountries: jasmine.createSpy('getAllCountries').and.returnValue(of(mockCountries)),
  };

  const apiServiceMock = {
    getAllStates: jasmine.createSpy('getAllStates').and.returnValue(of(mockStates)),
    getAllCities: jasmine.createSpy('getAllCities').and.returnValue(of(mockCities)),
  };

  const notificationServiceMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
  };

  const toastrServiceMock = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    info: jasmine.createSpy('info'),
    warning: jasmine.createSpy('warning'),
    show: jasmine.createSpy('show'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        BrowserAnimationsModule,
        CitiesFilterComponent,
      ],
      providers: [
        { provide: CountryService, useValue: countryServiceMock },
        { provide: ApiService, useValue: apiServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CitiesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should reset the form and emit empty filter', () => {
    component.CityFilterForm.patchValue({
      id: '101',
      name: 'Ahmedabad',
      country_name: 'India',
      state_name: 'Gujarat',
    });

    component.onReset();

    expect(component.CityFilterForm.value).toEqual({
      id: null,
      name: null,
      country_name: null,
      state_name: null,
    });
  });

  it('should submit form with values', () => {
    component.CityFilterForm.patchValue({
      id: '1',
      name: 'Los Angeles',
      country_name: 'USA',
      state_name: 'California',
    });

    component.onSubmit();

    expect(component.CityFilterForm.valid).toBeTrue();
  });
});
