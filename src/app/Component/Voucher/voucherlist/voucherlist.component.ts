import { Voucher } from './../../../Models/voucher';
import { VoucherService } from './../../../Services/voucher.service';
import { VoucherfilterComponent } from './../voucherfilter/voucherfilter.component';
import { FilterService } from './../../../Services/filter.service';
import { NgClass, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Params, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';




@Component({
  selector: 'app-voucherlist',
  standalone:true,
  imports: [NgFor,RouterLink,VoucherfilterComponent],
  templateUrl: './voucherlist.component.html',
  styleUrl: './voucherlist.component.css'
})
export class VoucherlistComponent implements OnInit{

  router = inject(Router)
  vouchers!: Voucher[];
  totalRecords: number = 0; // Total number of vouchers
  page: number = 1; // Current page
  pageSize: number = 5;
  totalPages: number = 0;

constructor(private filterService:FilterService ,private voucherService: VoucherService ,private route:ActivatedRoute )
{  }


ngOnInit(): void
{
  this.route.queryParams.subscribe((params:Params)=>{
    const queryParams: HttpParams =this.filterService.updateQueryParams(params);
    this.fetchVoucher(queryParams);
  })


}

fetchVoucher(queryParams:HttpParams)
{
  queryParams = queryParams.set('page', this.page).set('limit', this.pageSize);
  this.voucherService.getVouchers(queryParams).subscribe((response :any)=>
    {
      this.vouchers=response.data;
      console.log('Response' ,response);


    });
}



      deleteVoucher(id: any): void
      {
        if (confirm("Are you sure you want to delete this voucher?")) {
          this.voucherService.deleteVoucher(id).subscribe({
            next: (response: any) => {
              alert("Voucher deleted successfully!");
              this.fetchVoucher(new HttpParams());


            },
            error: (error: any) => {
              console.error("Error deleting voucher:", error);
              alert("An error occurred while deleting the voucher. Please try again.");
            },


              //
          });
        }
      }



}
