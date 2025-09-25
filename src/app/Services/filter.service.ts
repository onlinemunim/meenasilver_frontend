import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }


  updateQueryParams(queryParams: Params): HttpParams {

    let params: HttpParams = new HttpParams();

    console.log(queryParams , "route params");

    Object.entries(queryParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params = params.set(key, value.join(','));
      } else {
        params = params.set(key, value);
      }
      // debugger;
      // console.log(params, "params filter service");
    });


    return params;
  }
}
