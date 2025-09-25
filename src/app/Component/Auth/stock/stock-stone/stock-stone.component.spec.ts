import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StockStoneComponent } from './stock-stone.component';
import { ProductService } from '../../../../Services/product.service';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { NotificationService } from '../../../../Services/notification.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';

describe('StockStoneComponent', () => {
  let component: StockStoneComponent;
  let fixture: ComponentFixture<StockStoneComponent>;
  let productServiceMock: any;
  let stockGeneralServiceMock: any;
  let notificationServiceMock: any;
  let firmSelectionServiceMock: any;
  let tabCommServiceMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getUnitTypes: jasmine.createSpy().and.returnValue(['gm']),
      CreateStone: jasmine.createSpy().and.returnValue(of({ data: { id: 1, stone_name: 'Ruby' } })),
      updateStone: jasmine.createSpy().and.returnValue(of({})),
      deleteStone: jasmine.createSpy().and.returnValue(of({})),
      getStonesByProductId: jasmine.createSpy().and.returnValue(of({ data: [] })),
      getStonesList: jasmine.createSpy().and.returnValue(of({ data: { id: 1, stone_name: 'Ruby' } })),
      getCategoryType: jasmine.createSpy().and.returnValue(of({ data: [{ categories: 'Precious' }] })),
      getCurrentUserId: jasmine.createSpy().and.returnValue(1),
    };

    stockGeneralServiceMock = {
      getProductId: jasmine.createSpy().and.returnValue(1),
      getCreatedProduct: jasmine.createSpy().and.returnValue({}),
      getProductById: jasmine.createSpy().and.returnValue(of({ data: {} })),
      getProducts: jasmine.createSpy().and.returnValue(of({ data: [] })),
      getStoneProductCodes: jasmine.createSpy().and.returnValue(of([])),
    };

    notificationServiceMock = {
      showError: jasmine.createSpy(),
      showSuccess: jasmine.createSpy(),
    };

    firmSelectionServiceMock = {
      selectedFirmName$: of({ id: 101 }),
    };

    tabCommServiceMock = {
      setActiveTab: jasmine.createSpy(),
    };

    await TestBed.configureTestingModule({
      imports: [StockStoneComponent, ReactiveFormsModule, HttpClientModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: StockGeneralService, useValue: stockGeneralServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: FirmSelectionService, useValue: firmSelectionServiceMock },
        { provide: TabCommunicationService, useValue: tabCommServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StockStoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on init', () => {
    expect(component.stoneForm).toBeDefined();
    expect(productServiceMock.getUnitTypes).toHaveBeenCalled();
    expect(stockGeneralServiceMock.getProductId).toHaveBeenCalled();
  });

  it('should call addStoneDetail() when form is valid on submit', () => {
    component.stoneForm.setValue({
      code: 'ST001',
      // supplier_code: 'SUP001',
      st_product_code_type: 'SomeType',
      stone_name: 'Ruby',
      categories: 'Precious',
      quantity: 10,
      per_piece_weight: 0.5,
      unit: 'gm',
      total_weight: 5,
      per_piece_price: 100,
      total_price: 1000,
      firm_id: 101,
      user_id: 1,
      product_id: 1,
    });

    spyOn(component, 'addStoneDetail');
    component.onSubmit();
    expect(component.addStoneDetail).toHaveBeenCalled();
  });

  it('should show error notification if edit form is invalid', () => {
    component.stoneForm.reset(); // invalid form
    component.editStone();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith(
      'Form is invalid. Please check the fields.',
      'Validation Error'
    );
  });

  // it('should call updateStone and reset on editStone()', fakeAsync(() => {
  //   component.stoneForm.setValue({
  //     code: 'ST001',
  //     // supplier_code: 'SUP001',
  //     st_product_code_type: 'SomeType',
  //     stone_name: 'Ruby',
  //     categories: 'Precious',
  //     quantity: 10,
  //     per_piece_weight: 0.5,
  //     unit: 'gm',
  //     total_weight: 5,
  //     per_piece_price: 100,
  //     total_price: 1000,
  //     firm_id: 101,
  //     user_id: 1,
  //     product_id: 1,
  //   });
  //   component.StoneData = { id: 1 };
  //   component.editStone();
  //   tick();
  //   expect(productServiceMock.updateStone).toHaveBeenCalledWith(1, jasmine.any(Object));
  // }));

  it('should call deleteStone() and reload list on confirm', fakeAsync(() => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true }) as any);
    component.deleteStone(1);
    tick();
    expect(productServiceMock.deleteStone).toHaveBeenCalledWith(1);
  }));


});
