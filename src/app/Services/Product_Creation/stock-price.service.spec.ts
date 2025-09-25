// import { TestBed } from '@angular/core/testing';
// import { StockPriceService } from './stock-price.service';
// import { ApiService } from '../api.service';

// describe('StockPriceService', () => {
//   let service: StockPriceService;
//   let apiServiceSpy: jasmine.SpyObj<ApiService>;

//   beforeEach(() => {
//     const spy = jasmine.createSpyObj('ApiService', ['get', 'post', 'update', 'delete']);

//     TestBed.configureTestingModule({
//       providers: [
//         StockPriceService,
//         { provide: ApiService, useValue: spy }
//       ]
//     });

//     service = TestBed.inject(StockPriceService);
//     apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should call getStocksPrice()', () => {
//     service.getStocksPrice();
//     expect(apiServiceSpy.get).toHaveBeenCalledWith('product_prices');
//   });

//   it('should call getStockPrice() with ID', () => {
//     service.getStockPrice(42);
//     expect(apiServiceSpy.get).toHaveBeenCalledWith('product_prices/42');
//   });

//   it('should call createStocksPrice() with data', () => {
//     const data = { price: 100 };
//     service.createStocksPrice(data);
//     expect(apiServiceSpy.post).toHaveBeenCalledWith('product_prices', data);
//   });

//   it('should call updateStockPrice() with ID and data', () => {
//     const data = { price: 120 };
//     service.updateStockPrice(42, data);
//     expect(apiServiceSpy.update).toHaveBeenCalledWith('product_prices/42', data);
//   });

//   it('should call deleteStocksPrice() with data', () => {
//     const data = { id: 42 };
//     service.deleteStocksPrice(data);
//     expect(apiServiceSpy.delete).toHaveBeenCalledWith('product_prices', data);
//   });
// });
