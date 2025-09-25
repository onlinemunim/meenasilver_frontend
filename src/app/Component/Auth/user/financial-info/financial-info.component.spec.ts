import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialInfoComponent } from './financial-info.component';
import { BankService } from '../../../../Services/Bank/bank.service';
import { ApiService } from '../../../../Services/api.service';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

describe('FinancialInfoComponent', () => {
  let component: FinancialInfoComponent;
  let fixture: ComponentFixture<FinancialInfoComponent>;
  let bankService: jasmine.SpyObj<BankService>;
  let routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    const bankServiceSpy = jasmine.createSpyObj('BankService', [
      'createBankInfo',
      'getBanksInfo',
      'getBankInfo',
      'deleteBankInfo',
      'updateBankInfo'
    ]);

    bankServiceSpy.getBanksInfo.and.returnValue(of({ data: [] }));

    await TestBed.configureTestingModule({
      imports: [
        FinancialInfoComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: BankService, useValue: bankServiceSpy },
        { provide: Router, useValue: routerSpy },
        FormBuilder,
        ApiService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FinancialInfoComponent);
    component = fixture.componentInstance;
    bankService = TestBed.inject(BankService) as jasmine.SpyObj<BankService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    spyOn(component, 'initBankForm');
    spyOn(component, 'getBanksInfo');
    component.ngOnInit();
    expect(component.initBankForm).toHaveBeenCalled();
    expect(component.getBanksInfo).toHaveBeenCalled();
  });

  it('should call createBankInfo on form submit', () => {
    const mockResponse = { data: {} };
    bankService.createBankInfo.and.returnValue(of(mockResponse));
    bankService.getBanksInfo.and.returnValue(of({ data: [] }));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: true
    }));

    component.bankForm.setValue({
      bank_account_type: 'Saving',
      bank_acc_no: '1234567890',
      bank_name: 'SBI',
      bank_ifsc_code: 'SBIN0001234',
      bank_branch_name: 'Branch',
      bank_nominee_name: 'Nominee',
      bank_nominee_relation: 'Father',
      user_id: 1
    });

    component.OnSubmit();
    expect(bankService.createBankInfo).toHaveBeenCalled();
  });

  it('should call deleteBankInfo on confirm', async () => {
    bankService.deleteBankInfo.and.returnValue(of({}));
    bankService.getBanksInfo.and.returnValue(of({ data: [] }));

    spyOn(window, 'confirm').and.returnValue(true); // mock confirm dialog

    await component.deleteBankDetails(1);

    expect(bankService.deleteBankInfo).toHaveBeenCalledWith(1);
  });

  it('should patch form on patchForUpdate', () => {
    const mockBankData = {
      bank_id: 5,
      bank_account_type: 'Current',
      bank_acc_no: '12345',
      bank_name: 'SBI',
      bank_ifsc_code: 'SBIN00123',
      bank_branch_name: 'XYZ Branch',
      bank_nominee_name: 'Someone',
      bank_nominee_relation: 'Father',
      user_id: 1
    };
    bankService.getBankInfo.and.returnValue(of({ data: mockBankData }));

    component.patchForUpdate(5);
    expect(bankService.getBankInfo).toHaveBeenCalledWith(5);
    expect(component.bankForm.value.bank_name).toEqual('SBI');
    expect(component.submitButton).toBeFalse();
    expect(component.updateButton).toBeTrue();
  });

  it('should call updateBankInfo on updateBankDetails with filled form', () => {
    component.bankId = 1;
    bankService.updateBankInfo.and.returnValue(of({}));
    bankService.getBanksInfo.and.returnValue(of({ data: [] }));
    spyOn(Swal, 'fire').and.returnValue(Promise.resolve({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
      value: true
    }));

    component.bankForm.patchValue({
      bank_account_type: 'Saving',
      bank_acc_no: '999999',
      bank_name: 'SBI',
      bank_ifsc_code: 'SBIN000999',
      bank_branch_name: 'XYZ',
      bank_nominee_name: 'John',
      bank_nominee_relation: 'Brother',
      user_id: 1
    });

    component.updateBankDetails();

    expect(bankService.updateBankInfo).toHaveBeenCalledWith(1, jasmine.objectContaining({
      bank_account_type: 'Saving',
      bank_acc_no: '999999',
      bank_name: 'SBI',
      bank_ifsc_code: 'SBIN000999',
      bank_branch_name: 'XYZ',
      bank_nominee_name: 'John',
      bank_nominee_relation: 'Brother',
      user_id: 1
    }));
  });

  it('should call updateBankInfo with null values if form is empty', () => {
    component.bankId = 1;
    bankService.updateBankInfo.and.returnValue(of({}));

    component.bankForm.reset();

    component.updateBankDetails();

    expect(bankService.updateBankInfo).toHaveBeenCalledWith(1, jasmine.objectContaining({
      bank_account_type: null,
      bank_acc_no: null,
      bank_name: null,
      bank_ifsc_code: null,
      bank_branch_name: null,
      bank_nominee_name: null,
      bank_nominee_relation: null,
      user_id: null
    }));
  });
});
