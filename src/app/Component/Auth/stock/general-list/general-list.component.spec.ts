import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GeneralListComponent } from './general-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from '../../../../Services/api.service';
import { ToastrService } from 'ngx-toastr';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('GeneralListComponent', () => {
  let component: GeneralListComponent;
  let fixture: ComponentFixture<GeneralListComponent>;
  let stockGeneralService: StockGeneralService;

  beforeEach(async () => {
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false
    }));

    const mockStockGeneralService = {
      getProducts: jasmine.createSpy().and.returnValue(of({ data: [] })),
      deleteProduct: jasmine.createSpy().and.returnValue(of({})),
      getGeneralProductListOnly: jasmine.createSpy().and.returnValue(of({ data: [] })) // ✅ Added this
    };

    const mockToastrService = {
      success: jasmine.createSpy(),
      error: jasmine.createSpy(),
      warning: jasmine.createSpy(),
      info: jasmine.createSpy(),
    };

    const mockActivatedRoute = {
      params: of({}),
      queryParams: of({}),
      snapshot: {
        paramMap: {
          get: () => null
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,GeneralListComponent],
      providers: [
        { provide: StockGeneralService, useValue: mockStockGeneralService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ToastrService, useValue: mockToastrService },
        ApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GeneralListComponent);
    component = fixture.componentInstance;
    stockGeneralService = TestBed.inject(StockGeneralService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should call getStockGeneralList when component is initialized', async () => {
  //   await fixture.whenStable();
  //   fixture.detectChanges();
  //   expect(stockGeneralService.getGeneralProductListOnly).toHaveBeenCalled();
  // });


  it('should delete a product and refresh the list', async () => {
    const id = 1;
    spyOn(component, 'getStockGeneralList');
    await component.deleteGeneralProduct(id);
    expect(Swal.fire).toHaveBeenCalled();
    expect(stockGeneralService.deleteProduct).toHaveBeenCalledWith(id);
    expect(component.getStockGeneralList).toHaveBeenCalled();
  });

  it('should paginate the list correctly', () => {
    component.stockGeneralList = Array(25).fill({});
    component.updatePaginatedList();
    expect(component.paginatedStockList.length).toBe(10);
  });
});
