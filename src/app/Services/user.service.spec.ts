import { Params } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { UserServiceService } from './user.service';
import { ApiService } from './api.service';
import { HttpParams, provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('UserService', () => {
  let service: UserServiceService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'update']);

    TestBed.configureTestingModule({
      providers: [
        UserServiceService,
        { provide: ApiService, useValue: apiServiceSpy },
        provideHttpClient(),
      ]
    });

    service = TestBed.inject(UserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call apiService.get with correct ID when getUser is called', () => {
    const mockUser = { id: 1, name: 'John Doe' , email:"john@doe.com" };
    apiServiceSpy.get.and.returnValue(of(mockUser));

    service.getUser(1).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('users/1');
  });

  it('should call apiService.post with correct data when createUser is called', () => {
    const newUser = { name: 'Jane Doe', email: 'jane@example.com' };
    apiServiceSpy.post.and.returnValue(of({ success: true }));

    service.createUser(newUser).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('users', newUser);
  });

  it('should call apiService.update with correct data when updateUser is called', () => {
    const updatedUser = { name: 'John Updated', email: 'john_updated@example.com' };
    apiServiceSpy.update.and.returnValue(of({ success: true }));

    service.updateUser(1, updatedUser).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    expect(apiServiceSpy.update).toHaveBeenCalledWith('users/1', updatedUser);
  });

});
