import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockGeneralComponent } from './stock-general.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { InjectionToken } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

const ToastConfigMock = {
  positionClass: 'toast-top-right',
  timeOut: 3000,
};

const firmMock = { id: 123 };

class MockFirmSelectionService {
  selectedFirmName$ = new BehaviorSubject(firmMock);
}

const mockStockGeneralService = {
  createProducts: jasmine.createSpy('createProducts').and.returnValue(of({ data: { id: 99 } })),
  setProductId: jasmine.createSpy('setProductId'),
  getCategories: jasmine.createSpy('getCategories').and.returnValue(of({ data: [{ name: 'Category1' }] })),
  getSubCategories: jasmine.createSpy('getSubCategories').and.returnValue(of({ data: [{ name: 'SubCat1' }] })),
  getCreatedProduct: jasmine.createSpy('getCreatedProduct').and.returnValue(of({ data: { id: 99 } })),
  setCreatedProduct: jasmine.createSpy('setCreatedProduct'),
  getProductById: jasmine.createSpy('getProductById').and.returnValue(of({ data: { id: 99, name: 'Test Product' } })),
  getProducts: jasmine.createSpy('getProducts').and.returnValue(of({ data: [{ id: 1, name: 'Product1' }] })),
};

describe('StockGeneralComponent', () => {
  let component: StockGeneralComponent;
  let fixture: ComponentFixture<StockGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StockGeneralComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: StockGeneralService, useValue: mockStockGeneralService },
        { provide: FirmSelectionService, useClass: MockFirmSelectionService },
        { provide: InjectionToken, useValue: ToastConfigMock },
        ToastrService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    expect(component.sockGeneralDetails).toBeDefined();
    expect(component.sockGeneralDetails.get('firm_id')?.value).toBe(firmMock.id);
  });

  // it('should submit form and call createProducts()', async () => {
  //   component.sockGeneralDetails.patchValue({
  //     barcode: '12345',
  //     product_name: 'Test Product',
  //     firm_id: firmMock.id,
  //     product_type: 'Type A',
  //     hsn_code: '1234',
  //     gst: 18,
  //     description: 'Test description'
  //   });

  //   await component.onSubmit();

  //   await fixture.whenStable();

  //   expect(mockStockGeneralService.createProducts).toHaveBeenCalled();
  //   expect(mockStockGeneralService.setProductId).toHaveBeenCalledWith(99);

  //   // Removed Swal.fire expectation
  // });
});
