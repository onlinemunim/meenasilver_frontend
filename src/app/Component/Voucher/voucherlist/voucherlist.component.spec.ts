// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpParams,provideHttpClient } from '@angular/common/http';
// import { of } from 'rxjs';
// import { Router, ActivatedRoute, RouterLink, provideRouter } from '@angular/router';
// import { NgFor } from '@angular/common';
// import { VoucherlistComponent } from './voucherlist.component';
// import { VoucherService } from './../../../Services/voucher.service';
// import { Voucher } from '../../../Models/voucher';


// describe('VoucherlistComponent', () => {
//   let component: VoucherlistComponent;
//   let fixture: ComponentFixture<VoucherlistComponent>;
//   let voucherServiceSpy: jasmine.SpyObj<VoucherService>;


//   beforeEach(async () => {
//     voucherServiceSpy =jasmine.createSpyObj('VoucherService',['getVouchers']);

//     await TestBed.configureTestingModule({
//       imports: [VoucherlistComponent,NgFor,RouterLink],
//       providers: [
//         { provide: VoucherService ,useValue: voucherServiceSpy},
//         provideHttpClient(),
//         provideRouter([]),
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(VoucherlistComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should fetchVoucher on initialization', () => {

//     const mockVouchers = {
//       data: [
//         {
//           id: 4,
//           name: 'vouchername',
//           description: 'voucherdescription',
//           code: 'ABC123',
//           creatorId: 1,
//           status: 'active',
//           discount_percentage: 10,
//           createdAt: '2025-01-01T00:00:00Z',
//           updatedAt: '2025-01-02T00:00:00Z',},

//         { id: 6,
//       name: 'vouchername',
//       description: 'voucherdescriptionwe',
//       code: 'XYZ789',
//       creatorId: 2,
//       status: 'inactive',
//       discount_percentage: 15,
//       createdAt: '2025-02-01T00:00:00Z',
//       updatedAt: '2025-02-02T00:00:00Z', },
//       ],
//     };

//     spyOn(component, 'fetchVoucher').and.callThrough();

//     voucherServiceSpy.getVouchers.and.returnValue(of(mockVouchers));
//     component.ngOnInit();

//     expect(component.fetchVoucher).toHaveBeenCalled();


//   });

//   it('should fetch vouchers and update the voucher list',()=>
//   {
//     const mockVouchers = {data: [
//         {
//           id: 4,
//           name :'vouchername',
//           description: 'voucherdescription',
//           code: 'ABC123',
//           creatorId: 1,
//           status: 'active',
//           discount_percentage: 10,
//           createdAt: new Date('2025-02-01T00:00:00Z'),
//           updatedAt: new Date('2025-02-02T00:00:00Z'),},

//             { id: 6,
//           name: 'vouchername',
//           description: 'voucherdescriptionwe',
//           code: 'XYZ789',
//           creatorId: 2,
//           status: 'inactive',
//           discount_percentage: 15,
//           createdAt: '2025-02-01T00:00:00Z',
//           updatedAt: '2025-02-02T00:00:00Z', }

//       ]};

//       voucherServiceSpy.getVouchers.and.returnValue(of(mockVouchers));

//       const params = new HttpParams();
//       component.fetchVoucher(params);
//       component.ngOnInit();

//       expect(voucherServiceSpy.getVouchers).toHaveBeenCalled();
//       expect(component.vouchers).toEqual(mockVouchers.data as Voucher[]);
//   });


// });
