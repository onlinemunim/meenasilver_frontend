import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryEditComponent } from './country-edit.component';
import { CountryService } from '../../../../Services/country.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('CountryEditComponent', () => {
  let component: CountryEditComponent;
  let fixture: ComponentFixture<CountryEditComponent>;
  let mockCountryService: jasmine.SpyObj<CountryService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCountryService = jasmine.createSpyObj('CountryService', ['getCountry', 'updateCountry']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CountryEditComponent, ReactiveFormsModule],
      providers: [
        { provide: CountryService, useValue: mockCountryService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CountryEditComponent);
    component = fixture.componentInstance;

    mockCountryService.getCountry.and.returnValue(of({ data: { name: 'USA', code: 'US', currency: 'USD' } }));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with fetched country data', () => {
    expect(component.editCountryForm.value).toEqual({ name: 'USA', code: 'US', currency: 'USD' });
  });

  it('should call updateCountry API on form submission', () => {
    component.editCountryForm.setValue({ name: 'Canada', code: 'CA', currency: 'CAD' });

    mockCountryService.updateCountry.and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(mockCountryService.updateCountry).toHaveBeenCalledWith(1, {
      name: 'Canada',
      code: 'CA',
      currency: 'CAD'
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/countries']);
  });
});//
