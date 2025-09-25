import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CustomSelectComponent } from '../../../../Core/custom-select/custom-select.component';
import { StoneFormComponent } from '../../stone-form/stone-form.component';
import { WholsaleImitationFashionJewelleryComponent } from './wholsale-imitation-fashion-jewellery.component';

import { FirmService } from '../../../../../Services/firm.service';
import { StockService } from '../../../../../Services/Stock/stock.service';
import { NotificationService } from '../../../../../Services/notification.service';

describe('WholsaleImitationFashionJewelleryComponent', () => {
  let component: WholsaleImitationFashionJewelleryComponent;
  let fixture: ComponentFixture<WholsaleImitationFashionJewelleryComponent>;

  // ✅ Mock services
  const mockFirmService = {
    getFirms: () => ({ subscribe: () => {} })
  };

  const mockStockService = {
    createStockEntry: () => ({ subscribe: () => {} })
  };

  const mockNotificationService = {
    showSuccess: () => {},
    showError: () => {}
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        RouterLinkActive,
        HttpClientTestingModule,
        CustomSelectComponent,
        StoneFormComponent,
        WholsaleImitationFashionJewelleryComponent
      ],
      providers: [
        provideRouter([]),
        { provide: FirmService, useValue: mockFirmService },
        { provide: StockService, useValue: mockStockService },
        { provide: NotificationService, useValue: mockNotificationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WholsaleImitationFashionJewelleryComponent);
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
