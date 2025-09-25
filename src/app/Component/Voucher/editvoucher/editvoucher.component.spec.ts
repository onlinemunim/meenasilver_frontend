import { VoucherService } from './../../../Services/voucher.service';
import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing'
import { EditvoucherComponent } from './editvoucher.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { fakeAsync, tick } from '@angular/core/testing';



describe('EditvoucherComponent', () => {
  let component: EditvoucherComponent;
  let fixture: ComponentFixture<EditvoucherComponent>;
  let voucherServiceSpy: jasmine.SpyObj<VoucherService>;
  let routerSpy: jasmine.SpyObj<Router>;


  beforeEach(async () => {
    voucherServiceSpy =jasmine.createSpyObj('VoucherService' ,['getVoucher','updateVoucher']);
    routerSpy = jasmine.createSpyObj('Router',['navigate']);
    const activatedRouteMock ={
      snapshot:{ params: { id :'10'}}
    };
       voucherServiceSpy.getVoucher.and.returnValue(of({ data: {name:'new voucher',status:'pending','code':'ASDSFFDG23'}}));
       voucherServiceSpy.updateVoucher.and.returnValue(of({success:true}));


    await TestBed.configureTestingModule({
      imports: [EditvoucherComponent,ReactiveFormsModule,],
      providers:[
        FormBuilder,
        {provide: VoucherService, useValue:voucherServiceSpy},
        {provide :Router ,useValue :routerSpy},
        {provide: ActivatedRoute,useValue:activatedRouteMock},

      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditvoucherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it ('should initialize the form on component init',()=>
    {
      expect(component.editVoucherForm).toBeDefined();
      expect(component.editVoucherForm.controls['name']).toBeDefined();
      expect(component.editVoucherForm.controls['status']).toBeDefined();
      expect(component.editVoucherForm.controls['code']).toBeDefined();
    } );

    it('should update voucher and navigate on submit', fakeAsync(() => {
      // Initialize the form
      // component.ngOnInit();
      // fixture.detectChanges();

      // Simulate user input
      component.editVoucherForm.setValue({
        name: 'New Name',
        description: 'New Description',
        code: 'NEWCODE123',
        approval_id: '1',
        status: 'Active',
        discount_percentage: '10',
      });

      // Call the submit function
      component.onSubmit();
      tick(); // Wait for async operations

      // Expect success message to be set
      expect(component.successMessage).toBe('Voucher updated successfully!');

      // Expect router to navigate
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/voucher']);
    }));
});
