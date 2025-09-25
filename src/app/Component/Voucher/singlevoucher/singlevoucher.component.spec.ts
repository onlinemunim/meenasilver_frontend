import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VoucherService } from '../../../Services/voucher.service';
import { provideRouter,Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SinglevoucherComponent } from './singlevoucher.component';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('SinglevoucherComponent', () => {
  let component: SinglevoucherComponent;
  let fixture: ComponentFixture<SinglevoucherComponent>;
  let voucherServiceSpy: jasmine.SpyObj<VoucherService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const activatedRouteMock = {
    snapshot: {
      params: {
        id: '123', // Example mock parameter
      },
    },
  };

  beforeEach(async () => {

    voucherServiceSpy = jasmine.createSpyObj('VoucherService', ['getVoucher']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    voucherServiceSpy.getVoucher.and.returnValue(
      of({
        name: 'Test Voucher',
        description: 'Test Description',
        code: 'TEST123',
        status: 'active',
        approval_id: '1',
        discount_percentage: '10',
      })
    );

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [SinglevoucherComponent],
      providers: [
        { provide: VoucherService, useValue: voucherServiceSpy }, // Provide mocked VoucherService
        { provide: Router, useValue: routerSpy }, // Provide mocked Router
        {provide: ActivatedRoute,useValue:activatedRouteMock},
        provideHttpClient(), // Provide HttpClient

      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglevoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should call getVoucher and load voucher details on init', () => {
    expect(voucherServiceSpy.getVoucher).toHaveBeenCalled();
  });


  it('should navigate to "/vouchers" on some action', () => {
    component.navigateToVouchers();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/voucher']);
  });
});



