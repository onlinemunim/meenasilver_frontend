import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnerService } from '../../../Services/Owner/owner.service';
import { OwnerCreateComponent } from './owner-create.component';
import { Router, provideRouter } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

describe('OwnerCreateComponent', () => {
  let component: OwnerCreateComponent;
  let fixture: ComponentFixture<OwnerCreateComponent>;
  let ownerServiceSpy: jasmine.SpyObj<OwnerService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    ownerServiceSpy = jasmine.createSpyObj('OwnerService', ['createOwner']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [OwnerCreateComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: OwnerService, useValue: ownerServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component init', () => {
    const fields = [
      'fname',
      'lname',
      'father_name',
      'dob',
      'sex',
      'qualification',
      'phone',
      'mobile',
      'sec_mobile',
      'email',
      'website',
      'ecomm_website',
      'since',
      'ref',
      'act_contact',
      'otp',
      'other_info',
      'image_id',
      'refferal_code',
      'last_column',
    ];

    expect(component.createOwnerForm).toBeDefined();

    fields.forEach((field) => {
      expect(component.createOwnerForm.controls[field]).toBeDefined();
    });
  });

  it('should call createUser on form submission', () => {
    const mockUser = {
      fname: 'John Doe',
      lname: 'John last name',
      father_name: 'johns father',
      dob: '1981-06-20',
      sex: 'other',
      qualification: 'thskdk',
      phone: '8524653218',
      mobile: '8524653218',
      sec_mobile: '8524653218',
      email: 'john@example.com',
      website: 'http://hello.com',
      ecomm_website: 'http://hello.com',
      since: '1981-06-20',
      ref: 'referance',
      act_contact: '2136547859',
      otp: '854796',
      other_info: 'other info',
      image_id: '36',
      refferal_code: 'ABCG5467',
      last_column: 'last column',
    };
    ownerServiceSpy.createOwner.and.returnValue(of({ success: true }));

    component.createOwnerForm.setValue(mockUser);
    component.onSubmit();

    expect(ownerServiceSpy.createOwner).toHaveBeenCalledWith(mockUser);
  });

  it('should navigate to "/users" after successful user creation', () => {
    ownerServiceSpy.createOwner.and.returnValue(of({ success: true }));

    component.onSubmit();
  });
});
