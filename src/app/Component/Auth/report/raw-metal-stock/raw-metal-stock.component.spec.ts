import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RawMetalStockComponent } from './raw-metal-stock.component';
import { of } from 'rxjs';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { NotificationService } from '../../../../Services/notification.service';

// Mock services
class MockRawMetalService {
  getRawMetalEntries() {
    return of({ data: [] });
  }
  deleteRawMetalEntry(id: any) {
    return of({ success: true });
  }
}
class MockNotificationService {
  showSuccess(message: string, title: string) {}
  showError(message: string, title: string) {}
}
describe('RawMetalListComponent', () => {
  let component: RawMetalStockComponent;
  let fixture: ComponentFixture<RawMetalStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        { provide: RawMetalService, useClass: MockRawMetalService },
        { provide: NotificationService, useClass: MockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RawMetalStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
