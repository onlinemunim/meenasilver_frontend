import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CitiesCreateComponent } from './cities-create.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CitiesService } from '../../../../Services/cities.service';
import { StatesService } from '../../../../Services/states.service';

describe('CitiesCreateComponent', () => {
  let component: CitiesCreateComponent;
  let fixture: ComponentFixture<CitiesCreateComponent>;
  let citiesServiceSpy: jasmine.SpyObj<CitiesService>;
  let statesServiceSpy: jasmine.SpyObj<StatesService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const citiesSpy = jasmine.createSpyObj('CitiesService', ['createCity']);
    const statesSpy = jasmine.createSpyObj('StatesService', ['getStates']);
    const toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [
        CitiesCreateComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: CitiesService, useValue: citiesSpy },
        { provide: StatesService, useValue: statesSpy },
        { provide: ToastrService, useValue: toastrServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CitiesCreateComponent);
    component = fixture.componentInstance;
    citiesServiceSpy = TestBed.inject(CitiesService) as jasmine.SpyObj<CitiesService>;
    statesServiceSpy = TestBed.inject(StatesService) as jasmine.SpyObj<StatesService>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on ngOnInit', () => {
    const mockStates = {
      data: [
        { id: 1, name: 'California', country: { id: 91, name: 'USA' } }
      ]
    };
    statesServiceSpy.getStates.and.returnValue(of(mockStates));

    fixture.detectChanges(); // triggers ngOnInit

    expect(component.createCityForm).toBeTruthy();
    expect(statesServiceSpy.getStates).toHaveBeenCalled();
    expect(component.states.length).toBe(1);
  });

  it('should call createCity on valid form submission', fakeAsync(() => {
    citiesServiceSpy.createCity.and.returnValue(of({ success: true }));

    component.inItForm();
    component.createCityForm.setValue({
      name: 'LosAngeles',
      state_id: 1,
      country_id: 91
    });

    component.onSubmit();
    tick();

    expect(citiesServiceSpy.createCity).toHaveBeenCalledWith({
      name: 'LosAngeles',
      state_id: 1,
      country_id: 91
    });
    expect(toastrSpy.success).toHaveBeenCalledWith('City created successfully');
  }));

  it('should show error if createCity fails', fakeAsync(() => {
    citiesServiceSpy.createCity.and.returnValue(throwError(() => new Error('Error')));

    component.inItForm();
    component.createCityForm.setValue({
      name: 'Houston',
      state_id: 2,
      country_id: 91
    });

    component.onSubmit();
    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('City creation failed');
  }));

  it('should not call createCity if form is invalid', () => {
    component.inItForm();
    component.createCityForm.setValue({
      name: '',  // invalid
      state_id: null,
      country_id: null
    });

    component.onSubmit();

    expect(citiesServiceSpy.createCity).not.toHaveBeenCalled();
    expect(toastrSpy.success).not.toHaveBeenCalled();
  });
});
