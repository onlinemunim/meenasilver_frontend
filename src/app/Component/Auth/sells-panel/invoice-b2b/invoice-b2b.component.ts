import { Component, inject, OnInit } from '@angular/core';
import { InvoiceService } from '../../../../Services/Invoice/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-invoice-b2b',
  imports: [NgFor],
  templateUrl: './invoice-b2b.component.html',
  styleUrl: './invoice-b2b.component.css'
})
export class InvoiceB2bComponent implements OnInit{

  private route = inject(ActivatedRoute);
  invoiceId!: string;
  invoiceData: any;
  totalAmount!: number;
  itemsTotalWeight!: number;
  itemsTotalAmount!: number;

  constructor(
      private invoiceService: InvoiceService,
    ) {}
  ngOnInit(){
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;
    // Load both data streams
    this.getSingleInvoiceData(this.invoiceId);
  }

  getSingleInvoiceData(id: any) {
    this.invoiceService.getInvoice(id).subscribe({
      next: (response: any) => {
        // Check if the API returned a valid response
        if (!response || !response.id) {
            console.error('API returned invalid invoice data.', response);
            return;
        }

        this.invoiceData = response;
        console.log("invoice data",this.invoiceData);


        // Calculations
        this.totalAmount =
          (Number(this.invoiceData?.taxable_amount || 0)) +
          (Number(this.invoiceData?.cgst || 0)) +
          (Number(this.invoiceData?.sgst || 0));
        this.totalAmount = Number(this.totalAmount.toFixed(2));

        this.itemsTotalWeight = this.invoiceData?.items?.reduce(
          (sum: number, item: any) => sum + Number(item.stout_total_wt || item.stout_net_weight || 0), 0
        );

        this.itemsTotalAmount = this.invoiceData?.items?.reduce(
          (sum: number, item: any) => sum + Number(item.stout_final_amount || 0), 0
        );

        this.itemsTotalWeight = Number(this.itemsTotalWeight.toFixed(2));
        this.itemsTotalAmount = Number(this.itemsTotalAmount.toFixed(2));
      },
      error: (err) => {
        // This block now catches API errors (404, 500, etc.)
        console.error('FAILED TO LOAD INVOICE DATA:', err);
      }
    });
  }
}
