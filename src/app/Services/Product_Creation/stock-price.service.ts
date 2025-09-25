import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StockPriceService {

  constructor(private apiService:ApiService) { }

  getStocksPrice(params:HttpParams){
    return this.apiService.get('product_prices');
  }

  getStockPrice(id:any){
    return this.apiService.get('product_prices/'+id);
  }

  createStocksPrice(data:any){
    return this.apiService.post('product_prices',data);
  }

  updateStockPrice(id:any,data:any){
    return this.apiService.update('product_prices/'+id,data);
  }

  deleteStocksPrice(id:any){
    return this.apiService.delete('product_prices/'+id);
  }

  //get data by product id(foreign key)
  getPriceDataByProductId(productId: any){
    return this.apiService.get(`product_prices?product_id=${productId}`);
  }

  //below methods for stock wastage only

  getAllWastageDetails(){
    return this.apiService.get('product_westages');
  }

  getWestageListByProductId(productId: number): Observable<any> {
    return this.apiService.get(`product_westages?product_id=${productId}`);
  }

  createWastage(data:any){
    return this.apiService.post('product_westages',data);
  }

  updateWastage(id:any,data:any){
    return this.apiService.update('product_westages'+id,data);
  }

  deleteWastage(id:any){
    return this.apiService.delete('product_westages/'+id);
  }


}
