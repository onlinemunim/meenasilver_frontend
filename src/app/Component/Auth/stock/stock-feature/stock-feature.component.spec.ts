import { ComponentFixture,TestBed,fakeAsync,flush,tick,} from '@angular/core/testing';
import { StockFeatureComponent } from './stock-feature.component'; // Import directly
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ProductService } from './../../../../Services/product.service';
import { ProductFeatureService } from './../../../../Services/product-feature.service';
import { NotificationService } from './../../../../Services/notification.service';
import { StockGeneralService } from './../../../../Services/Product_Creation/stock-general.service';
import { FirmSelectionService } from './../../../../Services/firm-selection.service';
import { TabCommunicationService } from './../../../../Services/Stock-Tabs/tab-communication.service';
import Swal from 'sweetalert2';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('StockFeatureComponent', () => {
  let component: StockFeatureComponent;
  let fixture: ComponentFixture<StockFeatureComponent>;

  const mockProductFeatureService = {
    createFeature: jasmine
      .createSpy()
      .and.returnValue(of({ data: { featurestatus: 'yes' } })),
    getFeaturesByProductId: jasmine
      .createSpy()
      .and.returnValue(of({ data: [] })),
    getFeatureList: jasmine
      .createSpy()
      .and.returnValue(
        of({ data: { featurename: 'Test', featurestatus: 'yes' } })
      ),
    updateFeature: jasmine.createSpy().and.returnValue(of({})),
    deleteFeature: jasmine.createSpy().and.returnValue(of({})),
  };

  const mockNotificationService = {
    showSuccess: jasmine.createSpy(),
  };

  const mockStockGeneralService = {
    getProductId: jasmine.createSpy().and.returnValue('1'),
    getCreatedProduct: jasmine.createSpy().and.returnValue({}),
    getProductById: jasmine.createSpy().and.returnValue(of({ data: {} })),
  };

  const mockFirmSelectionService = {
    selectedFirmName$: of({ id: 101 }),
  };

  const mockTabCommunicationService = {
    setActiveTab: jasmine.createSpy(),
  };

  beforeEach(async () => {
    spyOn(Swal, 'fire');
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        CommonModule,
        HttpClientTestingModule,
        StockFeatureComponent,
      ], // Import standalone component here
      providers: [
        FormBuilder,
        { provide: ProductFeatureService, useValue: mockProductFeatureService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: StockGeneralService, useValue: mockStockGeneralService },
        { provide: FirmSelectionService, useValue: mockFirmSelectionService },
        {
          provide: TabCommunicationService,
          useValue: mockTabCommunicationService,
        },
        { provide: ProductService, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockFeatureComponent);
    component = fixture.componentInstance;
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    localStorage.setItem('createdProductId', JSON.stringify(1));
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and fetch feature list on init', () => {
    expect(component.featureForm).toBeDefined();
    expect(mockProductFeatureService.getFeaturesByProductId).toHaveBeenCalled();
  });

  it('should go to packaging and pricing tab', () => {
    component.goToPackagingTab();
    component.goToPriceDetailsTab();

    expect(mockTabCommunicationService.setActiveTab).toHaveBeenCalledWith(3);
    expect(mockTabCommunicationService.setActiveTab).toHaveBeenCalledWith(5);
  });
});
