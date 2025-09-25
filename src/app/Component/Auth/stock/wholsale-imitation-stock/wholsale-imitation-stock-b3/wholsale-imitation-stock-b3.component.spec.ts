import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WholsaleImitationStockB3Component } from './wholsale-imitation-stock-b3.component';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

// Mock versions of services used in the component
import { FirmService } from '../../../../../Services/firm.service';
import { StockService } from '../../../../../Services/Stock/stock.service';
import { NotificationService } from '../../../../../Services/notification.service';

class MockFirmService {
  getFirms() {
    return of({ data: [{ name: 'Firm A' }, { name: 'Firm B' }] });
  }
}

class MockStockService {
  createStockEntry(data: any) {
    return of({}); // Simulate success response
  }
}

class MockNotificationService {
  showSuccess(message: string, title: string) {
    console.log(`Success: ${title} - ${message}`);
  }

  showError(message: string, title: string) {
    console.error(`Error: ${title} - ${message}`);
  }
}

describe('WholsaleImitationStockB3Component', () => {
  let component: WholsaleImitationStockB3Component;
  let fixture: ComponentFixture<WholsaleImitationStockB3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WholsaleImitationStockB3Component], // ✅ Standalone component must go in imports
      providers: [
        provideRouter([]),
        { provide: FirmService, useClass: MockFirmService },
        { provide: StockService, useClass: MockStockService },
        { provide: NotificationService, useClass: MockNotificationService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WholsaleImitationStockB3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
