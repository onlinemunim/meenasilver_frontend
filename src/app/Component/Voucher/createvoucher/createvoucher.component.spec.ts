import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreatevoucherComponent } from './createvoucher.component';
import { VoucherService } from '../../../Services/voucher.service';
import { FormBuilder,ReactiveFormsModule } from '@angular/forms';
import { provideRouter,Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
describe('CreatevoucherComponent', () => {
  let component: CreatevoucherComponent;
  let fixture: ComponentFixture<CreatevoucherComponent>;
  let voucherServiceSpy:jasmine.SpyObj<VoucherService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {

    voucherServiceSpy = jasmine.createSpyObj('VoucherService', ['createVoucher']);
    routerSpy = jasmine.createSpyObj('router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CreatevoucherComponent,ReactiveFormsModule],
      providers:[
        FormBuilder,
        {provide:VoucherService,useValue:voucherServiceSpy},
        {provide: Router,useValue:routerSpy},
        provideHttpClient(),
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatevoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();

  });

  it('should initialize the form on component init',() =>
  {
    expect(component.createVoucherForm).toBeDefined();
    expect(component.createVoucherForm.controls['name']).toBeDefined();
    expect(component.createVoucherForm.controls['description']).toBeDefined();
    expect(component.createVoucherForm.controls['code']).toBeDefined();
    expect(component.createVoucherForm.controls['approval_id']).toBeDefined();
    expect(component.createVoucherForm.controls['status']).toBeDefined();
    expect(component.createVoucherForm.controls['discount_percentage']).toBeDefined();
  });

  it('should call createVoucher on form submission',()=>
  {
    const mockVoucher ={
      name:'Diwali offer',
      description:'diwalioffrt',
      creator_id: '4',
      code:'ASDF123',
      approval_id:'1',
      status:'pending',
      discount_percentage:'50'
    };
    voucherServiceSpy.createVoucher.and.returnValue(of({ success: true }));

  component.createVoucherForm.setValue(mockVoucher);
  component.onSubmit();
  expect(voucherServiceSpy.createVoucher).toHaveBeenCalledWith(mockVoucher);
  });

  it('should navigate to "/vouchers" after successful voucher creation',()=>
  {
    voucherServiceSpy.createVoucher.and.returnValue(of({success:true}));
    component.onSubmit();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/voucher']);
  }
  );
});
