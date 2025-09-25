import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { MetalService } from './metal.service';
describe('MetalService', () => {
  let service: MetalService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['showSuccess', 'showError']);

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserId']);

    apiServiceSpy = jasmine.createSpyObj('ApiService', ['get', 'post', 'update', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: ApiService, useValue: apiServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['success', 'error']) },

        provideHttpClient(),
      ]
    });


    service = TestBed.inject(MetalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call apiService.get with correct ID when getMetalsList is called', () => {
    const mockMetal = { id: 1, name: 'Metal 1' };
    apiServiceSpy.get.and.returnValue(of(mockMetal));

    service.getMetalsList(1).subscribe(metal => {
      expect(metal).toEqual(mockMetal);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('assembly_metal_parts/1');
  });

  it('should call apiService.get with correct ID when getMetalList is called', () => {
    const mockMetalList = [{ id: 1, name: 'Metal 1' }, { id: 2, name: 'Metal 2' }];
    apiServiceSpy.get.and.returnValue(of(mockMetalList));

    service.getMetalList().subscribe(metalList => {
      expect(metalList).toEqual(mockMetalList);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('assembly_metal_parts');
  });
  it('should call apiService.post with correct data when CreateMetal is called', () => {
    const newMetal = { name: 'New Metal' };
    apiServiceSpy.post.and.returnValue(of({ data: 'success' }));

    service.CreateMetal(newMetal).subscribe(response => {
      expect(response).toEqual({ data: 'success' });
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('assembly_metal_parts', newMetal);
  }
  );
  it('should call apiService.delete with correct ID when deleteMetal is called', () => {
    const mockId = 1;
    apiServiceSpy.delete.and.returnValue(of({ data: 'success' }));

    service.deleteMetal(mockId).subscribe(response => {
      expect(response).toEqual({ data: 'success' });
    });

    expect(apiServiceSpy.delete).toHaveBeenCalledWith('assembly_metal_parts/1');
  });
});
