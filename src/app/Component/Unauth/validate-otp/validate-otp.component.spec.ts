import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateOtpComponent } from './validate-otp.component';

describe('ValidateOtpComponent', () => {
  let component: ValidateOtpComponent;
  let fixture: ComponentFixture<ValidateOtpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateOtpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
