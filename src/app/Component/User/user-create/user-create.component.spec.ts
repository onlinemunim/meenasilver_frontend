import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserCreateComponent } from './user-create.component';
import { UserServiceService } from '../../../Services/user.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('UserCreateComponent', () => {
  let component: UserCreateComponent;
  let fixture: ComponentFixture<UserCreateComponent>;
  let userServiceSpy: jasmine.SpyObj<UserServiceService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    userServiceSpy = jasmine.createSpyObj('UserServiceService', ['createUser']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [UserCreateComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: UserServiceService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        provideHttpClient(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component init', () => {
    expect(component.createUserForm).toBeDefined();
    expect(component.createUserForm.controls['name']).toBeDefined();
    expect(component.createUserForm.controls['email']).toBeDefined();
    expect(component.createUserForm.controls['password']).toBeDefined();
  });

  it('should call createUser on form submission', () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com', password: '1234' };
    userServiceSpy.createUser.and.returnValue(of({ success: true }));

    component.createUserForm.setValue(mockUser);
    component.onSubmit();

    expect(userServiceSpy.createUser).toHaveBeenCalledWith(mockUser);
  });

  it('should navigate to "/users" after successful user creation', () => {
    userServiceSpy.createUser.and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/users']);
  });
});
