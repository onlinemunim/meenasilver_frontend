import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserListComponent } from './user-list.component';
import { UserServiceService } from '../../../Services/user.service';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { provideRouter, RouterLink } from '@angular/router';
import { NgFor } from '@angular/common';
import { of } from 'rxjs';

describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserServiceService>;

  beforeEach(async () => {

    userServiceSpy = jasmine.createSpyObj('UserServiceService', ['getUsers']);

    await TestBed.configureTestingModule({
      imports: [UserListComponent, NgFor, RouterLink],
      providers: [
        { provide: UserServiceService, useValue: userServiceSpy },
        provideHttpClient(),
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call fetchUsers on initialization', () => {
    spyOn(component, 'fetchUsers');
    fixture.detectChanges();
    expect(component.fetchUsers).toHaveBeenCalled();
  });

  it('should fetch users and update the users list', () => {
    const mockUsers = { data: [

      { id: 1, name: 'John Doe' , email:"john@doe.com" },
      { id: 2, name: 'Jane Doe',  email:"john@doe.com" }] };

    userServiceSpy.getUsers.and.returnValue(of(mockUsers));

    const params = new HttpParams();

    component.fetchUsers(params);

    expect(userServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers.data);
  });
});
