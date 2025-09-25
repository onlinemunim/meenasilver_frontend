import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnerEditComponent } from './owner-edit.component';
import { OwnerService } from '../../../Services/Owner/owner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('OwnerEditComponent', () => {
  let component: OwnerEditComponent;
  let fixture: ComponentFixture<OwnerEditComponent>;
  let ownerServiceSpy: jasmine.SpyObj<OwnerService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    ownerServiceSpy = jasmine.createSpyObj('OwnerService', [
      'getOwner',
      'updateOwner',
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const ActivatedRouteMock = {
      snapshot: { params: { id: '123' } },
    };

    ownerServiceSpy.getOwner.and.returnValue(
      of({
        data: {
          fname: 'John',
          lname: 'Doe',
          father_name: 'Robert Doe',
          dob: '1990-05-15',
          sex: 'Male',
          qualification: 'Bachelors Degree',
          phone: '1234567890',
          mobile: '9876543210',
          sec_mobile: '8765432109',
          email: 'john.doe@example.com',
          website: 'https://johndoe.com',
          ecomm_website: 'https://shop.johndoe.com',
          // since: '2015-06-01',
          // ref: 'Referral Code 123',
          act_contact: '8596321478',
          other_info: 'Some additional info about John',
          // image_id: 101,
          // refferal_code: 'REF12345',
          last_column: 'Some value',
        },
      })
    );
    ownerServiceSpy.updateOwner.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [OwnerEditComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: OwnerService, useValue: ownerServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: ActivatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch owner details and patch the form', () => {
    component.ownerId = '123';
    component.fetchOwner();

    expect(ownerServiceSpy.getOwner).toHaveBeenCalledWith('123');
    expect(component.editOwnerForm.value).toEqual({
      fname: 'John',
      lname: 'Doe',
      father_name: 'Robert Doe',
      dob: '1990-05-15',
      sex: 'Male',
      qualification: 'Bachelors Degree',
      phone: '1234567890',
      mobile: '9876543210',
      sec_mobile: '8765432109',
      email: 'john.doe@example.com',
      website: 'https://johndoe.com',
      ecomm_website: 'https://shop.johndoe.com',
      act_contact: '8596321478',
      other_info: 'Some additional info about John',
      last_column: 'Some value',
    });
  });

  it('should update owner and navigate to /owners on success', () => {
    component.ownerId = '123';
    component.editOwnerForm.setValue({
      fname: 'John',
      lname: 'Doe',
      father_name: 'Robert Doe',
      dob: '1990-05-15',
      sex: 'Male',
      qualification: 'Bachelor’s Degree',
      phone: '1234567890',
      mobile: '9876543210',
      sec_mobile: '8765432109',
      email: 'john.doe@example.com',
      website: 'https://johndoe.com',
      ecomm_website: 'https://shop.johndoe.com',
      act_contact: 'active_contact@example.com',
      other_info: 'Some additional info about John',
      last_column: 'Some value',
    });

    component.onSubmit();

    expect(ownerServiceSpy.updateOwner).toHaveBeenCalledWith(
      '123',
      component.editOwnerForm.value
    );
  });
});
