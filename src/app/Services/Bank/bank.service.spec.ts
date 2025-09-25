import { TestBed } from '@angular/core/testing';
import { BankService } from './bank.service';
import { ApiService } from '../api.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpParams } from '@angular/common/http';

describe('BankService', () => {
  let service: BankService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'delete', 'update']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [
        BankService,
        { provide: ApiService, useValue: spy }
      ]
    });

    service = TestBed.inject(BankService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getBanksInfo()', () => {
    const params = new HttpParams();
    apiServiceSpy.get.and.returnValue(of([]));

    service.getBanksInfo(params).subscribe();

    expect(apiServiceSpy.get).toHaveBeenCalledWith('banks');
  });

  it('should call getBankInfo() with id', () => {
    const id = 1;
    apiServiceSpy.get.and.returnValue(of({}));

    service.getBankInfo(id).subscribe();

    expect(apiServiceSpy.get).toHaveBeenCalledWith(`banks/${id}`);
  });

  it('should call createBankInfo() with data', () => {
    const data = { name: 'Test Bank' };
    apiServiceSpy.post.and.returnValue(of(data));

    service.createBankInfo(data).subscribe();

    expect(apiServiceSpy.post).toHaveBeenCalledWith('banks', data);
  });

  it('should call deleteBankInfo() with id', () => {
    const id = 1;
    apiServiceSpy.delete.and.returnValue(of({}));

    service.deleteBankInfo(id).subscribe();

    expect(apiServiceSpy.delete).toHaveBeenCalledWith(`banks/${id}`);
  });

  it('should call updateBankInfo() with id and data', () => {
    const id = 1;
    const data = { name: 'Updated Bank' };
    apiServiceSpy.update.and.returnValue(of(data));

    service.updateBankInfo(id, data).subscribe();

    expect(apiServiceSpy.update).toHaveBeenCalledWith(`banks/${id}`, data);
  });
});
