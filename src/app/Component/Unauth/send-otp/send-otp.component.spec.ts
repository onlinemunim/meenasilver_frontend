import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SendOtpComponent } from './send-otp.component';
import { Router } from '@angular/router';

describe('SendOtpComponent', () => {
  let component: SendOtpComponent;
  let fixture: ComponentFixture<SendOtpComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendOtpComponent, RouterTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendOtpComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to "validate-otp" when validateOtp is called', () => {

    const navigateSpy = spyOn(router, 'navigate');

    component.validateOtp();

    expect(navigateSpy).toHaveBeenCalledWith(['validate-otp']);
  });
});
