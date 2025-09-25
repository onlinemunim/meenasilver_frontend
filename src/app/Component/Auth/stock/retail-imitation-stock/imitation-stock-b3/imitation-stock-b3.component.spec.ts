import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ToastrModule, ToastrService } from 'ngx-toastr';

import { CustomSelectComponent } from '../../../../Core/custom-select/custom-select.component';
import { StoneFormComponent } from '../../stone-form/stone-form.component';
import { ImitationStockB3Component } from './imitation-stock-b3.component';

// ✅ Mock the services used by the component
class MockFirmService {
  getFirms() {
    return {
      subscribe: (callback: any) => {
        callback({ data: [{ name: 'Firm A' }, { name: 'Firm B' }] });
      }
    };
  }
}

class MockStockService {
  createStockEntry(data: any) {
    return {
      subscribe: (success: any, error: any) => success(data)
    };
  }
}

class MockNotificationService {
  showSuccess(msg: string, title?: string) {}
  showError(msg: string, title?: string) {}
}

describe('ImitationStockB3Component', () => {
  let component: ImitationStockB3Component;
  let fixture: ComponentFixture<ImitationStockB3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterLink,
        RouterLinkActive,
        CustomSelectComponent,
        StoneFormComponent,
        ToastrModule.forRoot(), // ✅ provide ToastConfig via this
        ImitationStockB3Component
      ],
      providers: [
        provideRouter([]),
        { provide: ToastrService, useClass: ToastrService }, // Real, since we use ToastrModule.forRoot()
        { provide: 'FirmService', useClass: MockFirmService },
        { provide: 'StockService', useClass: MockStockService },
        { provide: 'NotificationService', useClass: MockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImitationStockB3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a stone form', () => {
    component.addStoneForm();
    expect(component.stoneForms.length).toBe(1);
  });

  it('should remove a stone form', () => {
    component.addStoneForm();
    component.addStoneForm();
    component.removeStoneForm(0);
    expect(component.stoneForms.length).toBe(1);
  });
});
