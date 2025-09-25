import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CustomizeService } from './customize.service';
import { ApiService } from '../api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('CustomizeService', () => {
  let service: CustomizeService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'update', 'delete']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        CustomizeService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(CustomizeService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call ApiService.get for getCustomizeSettings', () => {
    const mockResponse = [{ id: 1 }];
    apiServiceSpy.get.and.returnValue(of(mockResponse));

    service.getCustomizeSettings().subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('customize_settings');
  });

  it('should call ApiService.get with ID for getCustomizeSettingById', () => {
    const id = 1;
    const mockResponse = { id: 1 };
    apiServiceSpy.get.and.returnValue(of(mockResponse));

    service.getCustomizeSettingById(id).subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith('customize_settings/1');
  });

  it('should call ApiService.post for createCustomizeSetting', () => {
    const data = { name: 'Test' };
    apiServiceSpy.post.and.returnValue(of(data));

    service.createCustomizeSetting(data).subscribe(res => {
      expect(res).toEqual(data);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith('customize_settings', data);
  });

  it('should call ApiService.update for updateCustomizeSetting', () => {
    const id = 1;
    const data = { name: 'Updated' };
    apiServiceSpy.update.and.returnValue(of(data));

    service.updateCustomizeSetting(id, data).subscribe(res => {
      expect(res).toEqual(data);
    });

    expect(apiServiceSpy.update).toHaveBeenCalledWith('customize_settings/1', data);
  });

  it('should call ApiService.delete for deleteCustomizeSetting', () => {
    const id = 1;
    const response = { success: true };
    apiServiceSpy.delete.and.returnValue(of(response));

    service.deleteCustomizeSetting(id).subscribe(res => {
      expect(res).toEqual(response);
    });

    expect(apiServiceSpy.delete).toHaveBeenCalledWith('customize_settings/1');
  });
});
