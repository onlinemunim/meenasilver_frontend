import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFileUploadComponent } from './test-file-upload.component';
import { ApiService } from '../../Services/api.service';
import { NotificationService } from '../../Services/notification.service';
import { FirmService } from '../../Services/firm.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('TestFileUploadComponent', () => {
  let component: TestFileUploadComponent;
  let fixture: ComponentFixture<TestFileUploadComponent>;
  const mockFirmService = {
    testFileUpload: jasmine.createSpy().and.returnValue(of({ path: 'mock/path/image.jpg' }))
  };
  const mockNotificationService = {
    showSuccess: jasmine.createSpy(),
    showError: jasmine.createSpy()
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [TestFileUploadComponent],
      providers: [
        { provide: FirmService, useValue: mockFirmService },
        { provide: NotificationService, useValue: mockNotificationService },
        provideHttpClient(),
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
