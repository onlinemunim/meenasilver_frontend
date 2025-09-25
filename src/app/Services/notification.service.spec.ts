import { TestBed } from '@angular/core/testing';

import { ToastrService } from 'ngx-toastr';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ToastrService', ['success', 'error', 'info', 'warning', 'show']);

    TestBed.configureTestingModule({
      providers: [
        NotificationService,
        { provide: ToastrService, useValue: spy }
      ]
    });

    service = TestBed.inject(NotificationService);
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call success method of ToastrService', () => {
    service.showSuccess('Success Message', 'Success');
    expect(toastrServiceSpy.success).toHaveBeenCalledWith('Success Message', 'Success');
  });

  it('should call error method of ToastrService', () => {
    service.showError('Error Message', 'Error');
    expect(toastrServiceSpy.error).toHaveBeenCalledWith('Error Message', 'Error');
  });

  it('should call info method of ToastrService', () => {
    service.showInfo('Info Message', 'Info');
    expect(toastrServiceSpy.info).toHaveBeenCalledWith('Info Message', 'Info');
  });

  it('should call warning method of ToastrService', () => {
    service.showWarning('Warning Message', 'Warning');
    expect(toastrServiceSpy.warning).toHaveBeenCalledWith('Warning Message', 'Warning');
  });

  it('should call show method of ToastrService', () => {
    service.showDefault('Default Message', 'Default');
    expect(toastrServiceSpy.show).toHaveBeenCalledWith('Default Message', 'Default');
  });
});
