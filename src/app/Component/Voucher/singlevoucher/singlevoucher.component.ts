import { Component,inject,OnInit } from '@angular/core';
import { ActivatedRoute,Router,RouterLink } from '@angular/router';
import { FormBuilder,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { Voucher } from '../../../Models/voucher';
import { VoucherService } from '../../../Services/voucher.service';
import { HttpParams } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-singlevoucher',
  imports: [CommonModule],
  templateUrl: './singlevoucher.component.html',
  styleUrl: './singlevoucher.component.css'
})
export class SinglevoucherComponent
{

  activateroute = inject(ActivatedRoute);
  router = inject(Router)
  voucher!: Voucher;
  id:any;


constructor(private voucherService: VoucherService ,private fb:FormBuilder )
{  }


ngOnInit()
{
  this.id =this.activateroute.snapshot.params['id'];
  this.voucherService.getVoucher(this.id).subscribe((data:any)=>
  {
    console.log(data);
    this.voucher=data.data;
  })
}
navigateToVouchers(): void {
  this.router.navigate(['/voucher']);
}

}

