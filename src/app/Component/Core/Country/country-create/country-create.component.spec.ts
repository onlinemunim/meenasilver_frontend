import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryCreateComponent } from './country-create.component';
import { CountryService } from '../../../../Services/country.service';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('CountryCreateComponent', () => {
  let component: CountryCreateComponent;
  let fixture: ComponentFixture<CountryCreateComponent>;
  let mockCountryService: jasmine.SpyObj<CountryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCountryService = jasmine.createSpyObj('CountryService', ['createCountry']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CountryCreateComponent, ReactiveFormsModule],
      providers: [
        { provide: CountryService, useValue: mockCountryService },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CountryCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.createCountryForm.value).toEqual({ name: '', code: '', currency: '' });
  });

  it('should call createCountry API on form submission', () => {
    component.createCountryForm.setValue({ name: 'Germany', code: 'DE', currency: 'EUR' });

    mockCountryService.createCountry.and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(mockCountryService.createCountry).toHaveBeenCalledWith({
      name: 'Germany',
      code: 'DE',
      currency: 'EUR'
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/countries']);
  });
});//
