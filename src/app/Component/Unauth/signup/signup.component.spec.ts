import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';
import { UserServiceService } from '../../../Services/user.service';
import { NotificationService } from '../../../Services/notification.service';
import { ReactiveFormsModule } from '@angular/forms';
import { GstService } from '../../../gst.service';
import { ToastrModule } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';  // Import NoopAnimationsModule
import { By } from '@angular/platform-browser';

class MockGstService {
  getGstDetails(gstnumber: string) {
    return of({
      success: true,
      data: {
        gstnumber: '12ABCDE1234F1Z5',
        name: 'Test Name',
        state: 'State 1',
        country: 'India',
        address: 'Test Address',
      },
    });
  }
}

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['signup']);
    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        AuthService,
        UserServiceService,
        NotificationService,
        { provide: GstService, useClass: MockGstService },
        provideRouter([]),
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the signup form with correct controls', () => {
    expect(component.signUpForm.contains('name')).toBeTrue();
    expect(component.signUpForm.contains('mobilenumber')).toBeTrue();
    expect(component.signUpForm.contains('email')).toBeTrue();
    expect(component.signUpForm.contains('address')).toBeTrue();
    expect(component.signUpForm.contains('city')).toBeTrue();
    expect(component.signUpForm.contains('pincode')).toBeTrue();
    expect(component.signUpForm.contains('gstnumber')).toBeTrue();
    expect(component.signUpForm.contains('staffcode')).toBeTrue();
    expect(component.signUpForm.contains('password')).toBeTrue();
  });

  it('should call fetchStates on country change', () => {
    spyOn(component, 'fetchStates');
    component.signUpForm.controls['country'].setValue(1);
    component.onCountryChange();

    expect(component.fetchStates).toHaveBeenCalledWith(1);
  });

  it('should call fetchCities on state change', () => {
    spyOn(component, 'fetchCities');

    component.signUpForm.controls['state'].setValue(1);
    component.onStateChange();
    expect(component.fetchCities).toHaveBeenCalledWith(1);
  });

  it('should fetch countries from the service', () => {
    const countriesResponse = { data: ['India', 'USA'] };
    spyOn(component.userServiceForTest, 'getCountries').and.returnValue(of(countriesResponse));
    component.fetchCountries();
    expect(component.countries).toEqual(countriesResponse.data);
  });

  it('should fetch states for a selected country', () => {
    const statesResponse = { data: ['State 1', 'State 2'] };
    spyOn(component.userServiceForTest, 'getStates').and.returnValue(of(statesResponse));
    component.fetchStates(1);
    expect(component.states).toEqual(statesResponse.data);
  });

  it('should fetch cities for a selected state', () => {
    const citiesResponse = { data: ['City 1', 'City 2'] };
    spyOn(component.userServiceForTest, 'getCities').and.returnValue(of(citiesResponse));
    component.fetchCities(1);
    expect(component.cities).toEqual(citiesResponse.data);
  });

  it('should patch form data and fetch cities for state', () => {
    const response = {
      success: true,
      data: {
        gstnumber: '09AAACH7409R1ZZ',
        name: 'HINDUSTAN COPPER LTD',
        state: 1,
        city: 1,
        country: 1,
        address: '301 CHAITANYA2ND FLOORHINDUSTAN COPPER LIMITED',
        billingname: 'M/S HINDUSTAN COPPER LTD',
        pincode: '201304',
        mobilenumber: '',
        email: ''
      }
    };

    component.patchFormData(response);

    expect(component.signUpForm.value.gstnumber).toBe('09AAACH7409R1ZZ');
    expect(component.signUpForm.value.name).toBe('HINDUSTAN COPPER LTD');
    expect(component.signUpForm.value.state).toBe(1);
    expect(component.signUpForm.value.city).toBe(1);
    expect(component.signUpForm.value.billingname).toBe('M/S HINDUSTAN COPPER LTD');
    expect(component.signUpForm.value.mobilenumber).toBe('');
    expect(component.signUpForm.value.email).toBe('');
  });


  it('should disable submit button when form is invalid', () => {
    component.signUpForm.controls['name'].setValue('');
    component.signUpForm.controls['mobilenumber'].setValue('');
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeTrue();
  });

  it('should not call onSubmit when form is invalid', () => {
    spyOn(component, 'onSubmit');

    component.signUpForm.controls['name'].setValue('');
    component.signUpForm.controls['mobilenumber'].setValue('');
    component.signUpForm.controls['email'].setValue('');
    component.signUpForm.controls['address'].setValue('');
    component.signUpForm.controls['city'].setValue('');
    component.signUpForm.controls['pincode'].setValue('');
    component.signUpForm.controls['jewelleryappcode'].setValue('');
    component.signUpForm.controls['billingname'].setValue('');
    component.signUpForm.controls['state'].setValue('');
    component.signUpForm.controls['country'].setValue('');
    component.signUpForm.controls['gstnumber'].setValue('');
    component.signUpForm.controls['staffcode'].setValue('');
    component.signUpForm.controls['Captcha'].setValue('');
    component.signUpForm.controls['softwarepackages'].setValue('');
    component.signUpForm.controls['smsconsent'].setValue('');
    component.signUpForm.controls['password'].setValue('');
    component.signUpForm.controls['userid'].setValue('');

    component.signUpForm.updateValueAndValidity();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeTrue();
    submitButton.click();
    expect(component.onSubmit).not.toHaveBeenCalled();
  });
});
