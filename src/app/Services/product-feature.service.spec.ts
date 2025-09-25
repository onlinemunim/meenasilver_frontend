import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { ApiService } from './api.service';
import { provideHttpClient } from '@angular/common/http';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ProductFeatureService } from './product-feature.service';

describe('ProductService', () => {
  let service: ProductFeatureService;
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


    service = TestBed.inject(ProductFeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it('should call apiService.get with correct ID when getFeatureList is called', () => {
  //   const mockFeature = { id: 1, name: 'Feature 1' };
  //   apiServiceSpy.get.and.returnValue(of(mockFeature));

  //   service.getFeatureList(1).subscribe(feature => {
  //     expect(feature).toEqual(mockFeature);
  //   });

  //   expect(apiServiceSpy.get).toHaveBeenCalledWith('assembly_features/1');
  // }
  // );
  // it('should call apiService.get with correct ID when getFeaturesList is called', () => {
  //   const mockFeatureList = [{ id: 1, name: 'Feature 1' }, { id: 2, name: 'Feature 2' }];
  //   apiServiceSpy.get.and.returnValue(of(mockFeatureList));

  //   service.getFeaturesList().subscribe(featureList => {
  //     expect(featureList).toEqual(mockFeatureList);
  //   });

  //   expect(apiServiceSpy.get).toHaveBeenCalledWith('assembly_features');
  // }
  // );
  // it('should call apiService.post with correct data when createFeature is called', () => {
  //   const newFeature = { name: 'New Feature' };
  //   apiServiceSpy.post.and.returnValue(of({ data: 'success' }));

  //   service.createFeature(newFeature).subscribe(response => {
  //     expect(response).toEqual({ data: 'success' });
  //   });

  //   expect(apiServiceSpy.post).toHaveBeenCalledWith('assembly_features', newFeature);
  // }
  // );
  // it('should call apiService.delete with correct ID when deleteFeature is called', () => {
  //   const mockId = 1;
  //   apiServiceSpy.delete.and.returnValue(of({ data: 'success' }));

  //   service.deleteFeature(mockId).subscribe(response => {
  //     expect(response).toEqual({ data: 'success' });
  //   });

  //   expect(apiServiceSpy.delete).toHaveBeenCalledWith('assembly_features/1');
  // }
  // );
});
