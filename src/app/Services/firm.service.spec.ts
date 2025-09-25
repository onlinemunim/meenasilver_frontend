import { TestBed } from '@angular/core/testing';
import { FirmService } from './firm.service';
import { ApiService } from './api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
describe('FirmService', () => {
let service: FirmService;
let apiService: jasmine.SpyObj<ApiService>;
let httpTestingController: HttpTestingController;

beforeEach(() => {
const apiServiceSpy = jasmine.createSpyObj('ApiService', ['post', 'get']);

TestBed.configureTestingModule({
providers: [
FirmService,
{ provide: ApiService, useValue: apiServiceSpy },
provideHttpClient(withInterceptorsFromDi()),
provideHttpClientTesting()
]
});

service = TestBed.inject(FirmService);
apiService = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
httpTestingController = TestBed.inject(HttpTestingController);
});

afterEach(() => {
httpTestingController.verify();
});

it('should be created', () => {
expect(service).toBeTruthy();
});

describe('createFirm', () => {
it('should call apiService.post with correct endpoint and data', () => {
const testData = { name: 'Test Firm', type: 'LLP' };
const formData = new FormData();
formData.append('name', testData.name);
formData.append('type', testData.type);
apiService.post.and.returnValue(of({ success: true }));

service.createFirm(formData).subscribe(response => {
expect(response.success).toBeTrue();
});

expect(apiService.post).toHaveBeenCalledWith('firms', formData);
});
});

describe('getGstNumber', () => {
it('should call apiService.get with correct endpoint', () => {
apiService.get.and.returnValue(of({ data: ['GST1', 'GST2'] }));

service.getGstNumber().subscribe(response => {
expect(response).toEqual({ data: ['GST1', 'GST2'] });
});

expect(apiService.get).toHaveBeenCalledWith('firms/fetch-gst-no');
});

it('should handle error from apiService.get', () => {
const testError = new Error('Test Error');
apiService.get.and.returnValue(throwError(() => testError));

service.getGstNumber().subscribe({
error: (error) => {
expect(error).toBe(testError);
}
});

expect(apiService.get).toHaveBeenCalledWith('firms/fetch-gst-no');
});
});

describe('getFirmTypes', () => {
it('should return the correct array of firm types', () => {
const expectedTypes = [
'Private limited company',
'Public limited company',
'One person company',
'Limited liability (LLP)',
'Sole proprietorship',
'Partnership Firm',
'Company Limited Guaranty',
'Unlimited Company',
'Others types of company',
'Section & company',
'Subsidiary Company',
];

const result = service.getFirmTypes();
expect(result).toEqual(expectedTypes);
expect(result.length).toBe(11);
});
});

describe('createPaymentDetails', () => {
it('should call apiService.post with correct endpoint and data', () => {
const testData = { accountNumber: '123456', bankName: 'Test Bank' };
apiService.post.and.returnValue(of({ success: true }));

service.createPaymentDetails(testData).subscribe(response => {
expect(response.success).toBeTrue();
});

expect(apiService.post).toHaveBeenCalledWith('payments', testData);
});
});

describe('createSmtpDetails', () => {
it('should call apiService.post with correct endpoint and data', () => {
const testData = { host: 'smtp.test.com', port: 587 };
apiService.post.and.returnValue(of({ success: true }));

service.createSmtpDetails(testData).subscribe(response => {
expect(response.success).toBeTrue();
});

expect(apiService.post).toHaveBeenCalledWith('smpts', testData);
});
});

describe('createEInvoiceDetails', () => {
it('should call apiService.post with correct endpoint and data', () => {
const testData = { einvoiceId: 'EINV123', password: 'test123' };
apiService.post.and.returnValue(of({ success: true }));

service.createEInvoiceDetails(testData).subscribe(response => {
expect(response.success).toBeTrue();
});

expect(apiService.post).toHaveBeenCalledWith('einvoices', testData);
});
});

describe('createSocialMediaLinks', () => {
it('should call apiService.post with correct endpoint and data', () => {
const testData = { facebook: 'test', twitter: 'test' };
apiService.post.and.returnValue(of({ success: true }));

service.createSocialMediaLinks(testData).subscribe(response => {
expect(response.success).toBeTrue();
});

expect(apiService.post).toHaveBeenCalledWith('social_media', testData);
});
});
});
