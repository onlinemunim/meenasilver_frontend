import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CountryFilterComponent } from './country-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('CountryFilterComponent', () => {
  let component: CountryFilterComponent;
  let fixture: ComponentFixture<CountryFilterComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CountryFilterComponent, ReactiveFormsModule],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CountryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    const formValue = component.countryFilterForm.value;
    expect(formValue).toEqual({
      name: '',
      code: '',
      currency: '',
      id: ''
    });
  });

  it('should update query params on submit', () => {
    const form = component.countryFilterForm;
    form.setValue({
      name: 'India',
      code: 'IN',
      currency: 'INR',
      id: '1'
    });

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      queryParams: form.value,
      queryParamsHandling: 'merge'
    });
  });

  it('should reset the form and navigate with empty values on reset', () => {
    component.countryFilterForm.setValue({
      name: 'USA',
      code: 'US',
      currency: 'USD',
      id: '2'
    });

    component.onReset();

    expect(component.countryFilterForm.value).toEqual({
      name: null,
      code: null,
      currency: null,
      id: null
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        name: null,
        code: null,
        currency: null,
        id: null
      },
      queryParamsHandling: 'merge'
    });
  });

  it('should call onSubmit when Apply Filter button is clicked', () => {
    spyOn(component, 'onSubmit');
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    button.nativeElement.click();
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should call onReset when Reset button is clicked', () => {
    spyOn(component, 'onReset');
    const button = fixture.debugElement.query(By.css('button[type="button"]'));
    button.nativeElement.click();
    expect(component.onReset).toHaveBeenCalled();
  });
});
