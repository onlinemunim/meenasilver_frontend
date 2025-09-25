import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserEditComponent } from './user-edit.component';
import { UserServiceService } from '../../../Services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('UserEditComponent', () => {
  let component: UserEditComponent;
  let fixture: ComponentFixture<UserEditComponent>;
  let userServiceSpy: jasmine.SpyObj<UserServiceService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserServiceService', ['getUser', 'updateUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    const activatedRouteMock = {
      snapshot: { params: { id: '123' } }
    };


    userServiceSpy.getUser.and.returnValue(of({ data: { name: 'John Doe', email: 'john@example.com' } }));
    userServiceSpy.updateUser.and.returnValue(of({ success: true }));

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, UserEditComponent],
      providers: [
        FormBuilder,
        { provide: UserServiceService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component init', () => {
    expect(component.editUserForm).toBeDefined();
    expect(component.editUserForm.controls['name']).toBeDefined();
    expect(component.editUserForm.controls['email']).toBeDefined();
  });

  it('should update user and navigate on form submit', () => {
    const updatedUser = { name: 'Updated User', email: 'updated@example.com' };
    component.editUserForm.setValue(updatedUser);

    component.onSubmit();

    expect(userServiceSpy.updateUser).toHaveBeenCalledWith('123', updatedUser);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
  });
});
