import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormControl,FormGroup,ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
@Component({
  selector: 'app-voucherfilter',
  standalone: true,
  imports: [ReactiveFormsModule,MatFormFieldModule, MatSelectModule],
  templateUrl: './voucherfilter.component.html',
  styleUrl: './voucherfilter.component.css'
})
export class VoucherfilterComponent implements OnInit

{
  voucherFilterForm! : FormGroup;


  constructor (private fb: FormBuilder, private router: Router){}

  ngOnInit(): void
  {
      this.initform();

  }
  initform()
  {
      this.voucherFilterForm=this.fb.group({
        CreatorId: [''],
        name: [''],


      });
  }
  onSubmit() {
    this.router.navigate([], {
      queryParams: this.voucherFilterForm.value,
      queryParamsHandling: 'merge'
    });

  }

  onReset() {
    this.voucherFilterForm.reset();

    this.router.navigate([], {
      queryParams: this.voucherFilterForm.value,
      queryParamsHandling: 'merge'
    });
  }






}
