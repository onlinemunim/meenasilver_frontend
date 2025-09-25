import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StockPriceComponent } from './stock-price.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockPriceService } from '../../../../Services/Product_Creation/stock-price.service';
import { of, throwError } from 'rxjs';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { NotificationService } from '../../../../Services/notification.service';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';

describe('StockPriceComponent', () => {
  let component: StockPriceComponent;
  let fixture: ComponentFixture<StockPriceComponent>;
  let stockPriceServiceSpy: jasmine.SpyObj<StockPriceService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let firmSelectionServiceStub: Partial<FirmSelectionService>;
  let sharedProductServiceStub: Partial<SharedProductService>;

  beforeEach(async () => {
    stockPriceServiceSpy = jasmine.createSpyObj('StockPriceService', [
      'getStocksPrice',
      'createStocksPrice',
      'getWestageListByProductId',
      'deleteWastage',
      'createWastage'
    ]);

    stockPriceServiceSpy.getStocksPrice.and.returnValue(of({ data: [] }));
    stockPriceServiceSpy.createStocksPrice.and.returnValue(of({ data: { id: 123 } }));
    stockPriceServiceSpy.getWestageListByProductId.and.returnValue(of({ data: [] }));
    stockPriceServiceSpy.createWastage.and.returnValue(of({ data: {} }));
    stockPriceServiceSpy.deleteWastage.and.returnValue(of({}));

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError'
    ]);

    firmSelectionServiceStub = {
      selectedFirmName$: of({ id: 1, name: 'Test Firm' }),
    };

    sharedProductServiceStub = {
      getProductId: () => '1',
    };

    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    localStorage.setItem('createdProductId', '1');

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, StockPriceComponent],
      providers: [
        { provide: StockPriceService, useValue: stockPriceServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: FirmSelectionService, useValue: firmSelectionServiceStub },
        { provide: SharedProductService, useValue: sharedProductServiceStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockPriceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize stockPriceForm and stockWastageDetails forms', () => {
    expect(component.stockPriceForm).toBeDefined();
    expect(component.stockWastageDetails).toBeDefined();

    expect(component.stockPriceForm.get('user_id')?.value).toBe(1);
    expect(component.stockPriceForm.get('firm_id')?.value).toBe(1);
    expect(component.stockPriceForm.get('product_id')?.value).toBe('1');

    expect(component.stockWastageDetails.get('user_id')?.value).toBe(1);
  });

  it('should handle error when createStocksPrice fails', () => {
    stockPriceServiceSpy.createStocksPrice.and.returnValue(throwError(() => new Error('API error')));

    component.stockPriceForm.patchValue({
      purchase_price: 100,
      sell_price: 150,
      gst: 18,
      user_id: 1,
      firm_id: 1,
      product_id: '1',
    });

    component.onSubmit();

    expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
      'Something went wrong while saving the stock price.',
      'Submission Error'
    );
  });

  it('should get all wastage data and filter correctly', () => {
    const mockWastage = [
      { id: 1, product_id: 1, wastage: 5 },
      { id: 2, product_id: 2, wastage: 10 },
    ];

    stockPriceServiceSpy.getWestageListByProductId.and.returnValue(of({ data: mockWastage }));

    localStorage.setItem('createdProductId', '1');
    component.getAllWastageData();

    expect(component.wastageData.length).toBe(1);
    expect(component.wastageData[0].product_id).toBe(1);
  });

  it('should clear the wastage form and keep firm and product ids', () => {
    component.stockWastageDetails.patchValue({
      user_group: 'group1',
      wastage: 5,
      firm_id: 1,
      product_id: '1',
    });

    component.clearWastageData();

    expect(component.stockWastageDetails.get('wastage')?.value).toBeNull();
    expect(component.stockWastageDetails.get('firm_id')?.value).toBe(1);
    expect(component.stockWastageDetails.get('product_id')?.value).toBe('1');
  });

  it('should focus next input element on focusNext call', () => {
    const form = document.createElement('form');
    const input1 = document.createElement('input');
    input1.tabIndex = 0;
    const input2 = document.createElement('input');
    input2.tabIndex = 1;
    form.appendChild(input1);
    form.appendChild(input2);
    document.body.appendChild(form);

    const event = new KeyboardEvent('keydown', { bubbles: true });
    Object.defineProperty(event, 'target', { value: input1 });

    component.focusNext(event);

    expect(document.activeElement).toBe(input2);

    document.body.removeChild(form);
  });
});
