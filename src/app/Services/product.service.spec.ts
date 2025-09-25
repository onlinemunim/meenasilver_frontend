import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

describe('ProductService', () => {
  let service: ProductService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);
    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'update', 'delete']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);
    toastrServiceSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ToastrService, useValue: toastrServiceSpy },
        provideHttpClient(),
      ]
    });

    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should call apiService.get with correct ID when getStonesList is called', () => {
    const mockStone = { id: 1, name: 'Stone 1' };
    apiServiceSpy.get.and.returnValue(of(mockStone));

    service.getStonesList(1).subscribe(stone => {
      expect(stone).toEqual(mockStone);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('assembly_stones/1');
  });

  it('should call apiService.get when getStoneList is called', () => {
    const mockStoneList = [{ id: 1, name: 'Stone 1' }, { id: 2, name: 'Stone 2' }];
    apiServiceSpy.get.and.returnValue(of(mockStoneList));

    service.getStoneList(1).subscribe(stoneList => {
      expect(stoneList).toEqual(mockStoneList);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('assembly_stones');
  });


  it('should call apiService.post with correct data when CreateStone is called', () => {
    const newStone = { name: 'New Stone' };
    apiServiceSpy.post.and.returnValue(of({ data: 'success' }));

    service.CreateStone(newStone).subscribe(response => {
      expect(response).toEqual({ data: 'success' });
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('assembly_stones', newStone);
  });


  it('should call apiService.delete with correct ID when deleteStone is called', () => {
    const mockId = 1;
    apiServiceSpy.delete.and.returnValue(of({ data: 'success' }));

    service.deleteStone(mockId).subscribe(response => {
      expect(response).toEqual({ data: 'success' });
    });

    expect(apiServiceSpy.delete).toHaveBeenCalledWith('assembly_stones/1');
  });


  it('should return user ID from localStorage when getUserId is called', () => {
    const mockUser = { id: 123 };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));

    expect(service.getUserId()).toBe(123);
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
  });


  it('should return user ID from localStorage when getCurrentUserId is called', () => {
    const mockUser = { id: 456 };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));

    expect(service.getCurrentUserId()).toBe(456);
    expect(localStorage.getItem).toHaveBeenCalledWith('user');
  });
});
