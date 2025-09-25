// import { TestBed } from '@angular/core/testing';
// import { Params } from '@angular/router';
// import { VoucherService } from './voucher.service';
// import { ApiService } from './api.service';
// import { HttpParams,provideHttpClient } from '@angular/common/http';
// import { of } from 'rxjs';


// describe('VoucherService', () => {
//   let service: VoucherService;
//   let apiServiceSpy:jasmine.SpyObj<ApiService>;

//   beforeEach(() => {
//     apiServiceSpy = jasmine.createSpyObj('ApiService',['delete','get','post','update']);
//   beforeEach(() => {
//     apiServiceSpy = jasmine.createSpyObj('ApiService',['get','post','update']);

//     TestBed.configureTestingModule({
//       providers:[
//         VoucherService,
//         {
//           provide: ApiService,useValue: apiServiceSpy
//         },
//         provideHttpClient(),
//       ]
//     });
//     service = TestBed.inject(VoucherService);
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should call apiService.get with correct ID when getVoucher is called ',()=>
//   {
//     const mockVoucher={id: 1,name: 'voucher name', description: 'vocher description',code: 'ASDDF12' ,creator_id: '123', status: 'pending',discount_percentage: '50'};
//     apiServiceSpy.get.and.returnValue(of(mockVoucher));

//     service.getVoucher(1).subscribe(voucher =>
//     {
//       expect(voucher).toEqual(mockVoucher);
//     }
//     );

//     expect(apiServiceSpy.get).toHaveBeenCalledWith('vouchers/1');
//   });


//    it('should call apiService.post with correct data when createUser is called' ,()=>
//    {
//     const newVoucher={name: 'voucher name', description: 'vocher description',code: 'ASDMBHBNF12' ,creator_id: '123', status: 'pending',discount_percentage: '50'}
//     apiServiceSpy.post.and.returnValue(of({success : true}));

//     service.createVoucher(newVoucher).subscribe(response=>
//     {
//       expect(response).toEqual({ success:true});
//     }
//     );

//     expect(apiServiceSpy.post).toHaveBeenCalledWith('vouchers',newVoucher);

//   }
//   );



//   it('should call apiService.update with correct data when updateVoucher is called', () =>
//   {
//     const updateVoucher={
//       name:'updatedvoucher name',status: 'ASDSFDV123' ,discount_percentage: '67'
//     };
//     apiServiceSpy.update.and.returnValue(of({success: true}));

//     service.updateVoucher(1, updateVoucher).subscribe(response =>{
//       expect(response).toEqual({success: true});
//     });
//     expect(apiServiceSpy.update).toHaveBeenCalledWith('vouchers/1',updateVoucher);
//   });

//   it('should call apiService.delete with correct ID when deleteVoucher is called', () => {
//     apiServiceSpy.delete.and.returnValue(of({ success: true }));

//     service.deleteVoucher(1).subscribe(response => {
//       expect(response).toEqual({ success: true });
//     });

//     expect(apiServiceSpy.delete).toHaveBeenCalledWith('vouchers/1');
//   });

// });
