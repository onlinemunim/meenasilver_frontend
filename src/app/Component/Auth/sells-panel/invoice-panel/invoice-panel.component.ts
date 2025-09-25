import { FirmService } from './../../../../Services/firm.service';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { InvoiceService } from '../../../../Services/Invoice/invoice.service';
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';

@Component({
  selector: 'app-invoice-panel',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './invoice-panel.component.html',
  styleUrls: ['./invoice-panel.component.css']
})
export class InvoicePanelComponent implements OnInit {

  private route = inject(ActivatedRoute);
  invoiceId!: string;
  invoiceData: any;
  totalAmount!: number;
  itemsTotalWeight!: number;
  itemsTotalAmount!: number;
  bankDetails:any;

  // State Management Properties
  isLoading = true;
  loadingError = false;

  invoiceSettings: any;

  constructor(
    private invoiceService: InvoiceService,
    private customizeService: CustomizeService,
    private firmSelectionService: FirmSelectionService,
    private firmService: FirmService
  ) {}

  ngOnInit(): void {
    this.invoiceId = this.route.snapshot.paramMap.get('id')!;
    this.getSingleInvoiceData(this.invoiceId);
    this.subscribeToFirmChanges();
  }

  private subscribeToFirmChanges(): void {
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      if (firm?.id) {
        this.loadLayoutSettings(firm.id);
        this.firmService.getPaymentDetailsByFirmId(firm.id).subscribe((res:any)=>{
          if (res.data && res.data.length > 0) {
            this.bankDetails = res.data[0];
          }
        })
      } else {
        this.invoiceSettings = this.getDefaultSettings();
      }
    });
  }

  loadLayoutSettings(firmId: number): void {
    this.customizeService.getUserSettings(firmId).subscribe({
      next: (response) => {
        if (response.data && response.data.invoice_layout_settings && Object.keys(response.data.invoice_layout_settings).length > 0) {
          this.invoiceSettings = response.data.invoice_layout_settings;
        } else {
          this.invoiceSettings = this.getDefaultSettings();
        }
      },
      error: (err) => {
        console.error('Failed to load invoice layout settings, using defaults.', err);
        this.invoiceSettings = this.getDefaultSettings();
      }
    });
  }

  // --- MODIFIED: Added full error handling and state management ---
  getSingleInvoiceData(id: any) {
    this.invoiceService.getInvoice(id).subscribe({
      next: (response: any) => {
        // Check if the API returned a valid response
        if (!response || !response.id) {
            console.error('API returned invalid invoice data.', response);
            this.loadingError = true;
            this.isLoading = false;
            return;
        }

        this.invoiceData = response;

        // Calculations
        this.totalAmount =
          (Number(this.invoiceData?.taxable_amount || 0)) +
          (Number(this.invoiceData?.cgst || 0)) +
          (Number(this.invoiceData?.sgst || 0)) +
          (Number(this.invoiceData?.round_off || 0));
        this.totalAmount = Number(this.totalAmount.toFixed(2));

        this.itemsTotalWeight = this.invoiceData?.items?.reduce(
          (sum: number, item: any) => sum + Number(item.stout_total_wt || item.stout_net_weight || 0), 0
        );

        this.itemsTotalAmount = this.invoiceData?.items?.reduce(
          (sum: number, item: any) => sum + Number(item.stout_final_amount || 0), 0
        );

        this.itemsTotalWeight = Number(this.itemsTotalWeight.toFixed(2));
        this.itemsTotalAmount = Number(this.itemsTotalAmount.toFixed(2));

        // Everything loaded successfully
        this.isLoading = false;
        this.loadingError = false;
      },
      error: (err) => {
        // This block now catches API errors (404, 500, etc.)
        console.error('FAILED TO LOAD INVOICE DATA:', err);
        this.loadingError = true;
        this.isLoading = false;
      }
    });
  }

  // Provides default settings as a fallback
  getDefaultSettings(): any {
    return {
      header: {
        firmTitle: { text: 'Ram Krishna Jewels', visible: true, color: '#006269', fontSize: 30 },
        tagline: { text: 'Gold, Silver & Diamonds', visible: true, color: '#6b7280', fontSize: 14 },
        address: { text: 'Magarpatta Road, Hadapsar, Pune', visible: true, color: '#6b7280', fontSize: 14 },
        contactInfo: {
            phoneLabel: { text: 'Phone:', visible: true, color: '#ffffff', fontSize: 14 },
            phoneValue: { text: '8956428587', visible: true, color: '#ffffff', fontSize: 14 },
            emailLabel: { text: 'Email:', visible: true, color: '#ffffff', fontSize: 14 },
            emailValue: { text: 'ramkrishnajewels@gmail.com', visible: true, color: '#ffffff', fontSize: 14 }
        },
        bisLabel1: { text: 'Bis 916 Hallmark', visible: true, color: '#1f2937', fontSize: 12 },
        bisLabel2: { text: 'Gold Jewellery', visible: true, color: '#1f2937', fontSize: 12 },
        topLogo: { url: 'https://cdn-icons-png.flaticon.com/128/2230/2230534.png', visible: true },
        bisLogo: { url: 'https://www.presentations.gov.in/wp-content/uploads/2020/06/BIS-Hallmark_Preview.png', visible: true },
        backgroundImage: { url: 'assets/images/user/topimg.png', visible: true },
        borderColor: '#006269'
      },
      labels: {
          customerName: { text: 'Name', visible: true },
          customerAddress: { text: 'Address', visible: true },
          customerPhone: { text: 'Phone', visible: true },
          invoiceNo: { text: 'Invoice No', visible: true },
          invoiceDate: { text: 'Date', visible: true },
          gstin: { text: 'GSTIN', visible: true },
      },
      table: {
        header: { visible: true, color: '#FFFFFF', backgroundColor: '#006269', fontSize: 14 },
        body: { color: '#000000', fontSize: 12 },
        headers: [
          { text: 'Prod Id', visible: true }, { text: 'Design', visible: true }, { text: 'Desc', visible: true }, { text: 'Qty', visible: true }, { text: 'Wt', visible: true }, { text: 'MRP', visible: true }, { text: 'Amount', visible: true }
        ],
        summaryRow: { label: { text: 'Gold :', visible: true }, backgroundColor: '#9ae3e6', color: '#000000' }
      },
      paymentDetails: {
          backgroundColor: '#f3f4f6',
          labels: {
              cash: { text: 'Cash Receive :', visible: true }, cheque: { text: 'Cheque Receive :', visible: true }, card: { text: 'Card Receive :', visible: true }, online: { text: 'Online Payment :', visible: true }
          }
      },
      totals: {
          labels: {
              taxable: { text: 'Taxable Amt :', visible: true }, cgst: { text: 'Cgst(_%) :', visible: true }, sgst: { text: 'Sgst(_%) :', visible: true }, roundOff: { text: 'Round Off :', visible: true }, totalAmount: { text: 'Total Amount :', visible: true }, totalReceived: { text: 'Total Rec. Amt :', visible: true }
          }
      },
      taxSummaryTable: {
        header: { visible: true, color: '#374151', backgroundColor: '#e5e7eb', fontSize: 14 },
        headers: [
            { text: 'Hsn Code', visible: true }, { text: 'Taxable Value', visible: true }, { text: 'Cgst', visible: true }, { text: 'Amt', visible: true }, { text: 'Sgst', visible: true }, { text: 'Amt', visible: true }, { text: 'Total', visible: true },
        ],
        footer: { label: { text: 'Closing Balance', visible: true }, backgroundColor: '#d7f8f9', color: '#000000' }
      },
      terms: {
        title: { text: 'Terms And Conditions', visible: true, color: '#500000', fontSize: 14 },
        content: { text: '1. The price of the product...\n2. We require customers to pay in full...', visible: true, color: '#4a5568', fontSize: 12 }
      },
      signature: {
          customer: { text: 'Customer Signatory', visible: true, color: '#000000', fontSize: 14 },
          authorized: { text: 'Authorized Signatory', visible: true, color: '#000000', fontSize: 14 },
          thankYou: { text: 'Thank You For Business With Us', visible: true, color: '#006269', fontSize: 14 }
      },
      footer: {
        qrCode: {
            url: 'https://ramkrishnajewellers.com', visible: true,
            line1: { text: 'Scan To Visit Our Website!', visible: true, color: '#be185d', fontSize: 14 },
            line2: { text: 'Don\'t Miss Out On Amazing Deals!', visible: true, color: '#4a5568', fontSize: 12 }
        },
        tagline: {
            line1: { text: 'Jewelry That Dazzles, Day And Night.', visible: true, color: '#4a5568', fontSize: 14 },
            line2: { text: 'Celebrate Every Moment In Style With', visible: true, color: '#be185d', fontSize: 16 },
            line3: { text: 'Ramkrishna Jewellers', visible: true, color: '#9d174d', fontSize: 24 },
        },
        offer: {
            line1: { text: 'Be Dazzled', visible: true, color: '#be185d', fontSize: 30 },
            line2: { text: 'Up To', visible: true, color: '#4a5568', fontSize: 16 },
            line3: { text: '20%', visible: true, color: '#be185d', fontSize: 72 },
            line4: { text: 'Off* Diamond Prices', visible: true, color: '#4a5568', fontSize: 16 },
        },
        backgroundColor: '#fdf2f8'
      }
    };
  }
}
