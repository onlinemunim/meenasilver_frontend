import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { NotificationService } from '../../../../Services/notification.service';
import { RouterLink } from '@angular/router';

// Interface for a customizable element's style
export interface StyleSetting {
  visible: boolean;
  color: string;
  fontSize: number;
  text?: string;
  url?: string;
  backgroundColor?: string;
}

// A simpler interface for just text labels
export interface LabelSetting {
  visible: boolean;
  text: string;
}

@Component({
  selector: 'app-invoice-layout',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor,RouterLink],
  templateUrl: './invoice-layout.component.html',
  styleUrls: ['./invoice-layout.component.css']
})
export class InvoiceLayoutComponent implements OnInit {

  selectedFirmId!: number;
  activeEditor: any = null; // Can be StyleSetting or LabelSetting
  activeEditorLabel: string = '';

  invoiceSettings: any = this.getDefaultSettings();

  constructor(
    private customizeService: CustomizeService,
    private firmSelectionService: FirmSelectionService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      if (firm?.id) {
        this.selectedFirmId = firm.id;
        this.loadLayoutSettings();
      }
    });
  }

  // --- THIS METHOD IS NOW GREATLY EXPANDED to match the full invoice ---
  getDefaultSettings() {
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
          { text: 'Prod Id', visible: true },
          { text: 'Design', visible: true },
          { text: 'Desc', visible: true },
          { text: 'Qty', visible: true },
          { text: 'Wt', visible: true },
          { text: 'MRP', visible: true },
          { text: 'Amount', visible: true }
        ],
        summaryRow: {
            label: { text: 'Gold :', visible: true },
            backgroundColor: '#9ae3e6',
            color: '#000000'
        }
      },
      paymentDetails: {
          backgroundColor: '#f3f4f6',
          labels: {
              cash: { text: 'Cash Receive :', visible: true },
              cheque: { text: 'Cheque Receive :', visible: true },
              card: { text: 'Card Receive :', visible: true },
              online: { text: 'Online Payment :', visible: true }
          }
      },
      totals: {
          labels: {
              taxable: { text: 'Taxable Amt :', visible: true },
              cgst: { text: 'Cgst(_%) :', visible: true },
              sgst: { text: 'Sgst(_%) :', visible: true },
              roundOff: { text: 'Round Off :', visible: true },
              totalAmount: { text: 'Total Amount :', visible: true },
              totalReceived: { text: 'Total Rec. Amt :', visible: true }
          }
      },
      taxSummaryTable: {
        header: { visible: true, color: '#374151', backgroundColor: '#e5e7eb', fontSize: 14 },
        headers: [
            { text: 'Hsn Code', visible: true },
            { text: 'Taxable Value', visible: true },
            { text: 'Cgst', visible: true },
            { text: 'Amt', visible: true },
            { text: 'Sgst', visible: true },
            { text: 'Amt', visible: true },
            { text: 'Total', visible: true },
        ],
        footer: {
            label: { text: 'Closing Balance', visible: true },
            backgroundColor: '#d7f8f9',
            color: '#000000'
        }
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
            url: 'https://ramkrishnajewellers.com',
            visible: true,
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

  loadLayoutSettings(): void {
    if (!this.selectedFirmId) return;

    this.customizeService.getUserSettings(this.selectedFirmId).subscribe({
      next: (response) => {
        if (response.data && response.data.invoice_layout_settings && Object.keys(response.data.invoice_layout_settings).length > 0) {
          this.invoiceSettings = this.deepMerge(this.getDefaultSettings(), response.data.invoice_layout_settings);
        } else {
          this.invoiceSettings = this.getDefaultSettings();
        }
      },
      error: (err) => {
        console.error('Failed to load invoice layout settings', err);
        this.notificationService.showError('Could not load invoice settings.', 'Error');
      }
    });
  }

  saveLayoutSettings(): void {
    if (!this.selectedFirmId) {
      this.notificationService.showError('Firm not selected.', 'Error');
      return;
    }
    const payload = {
      customize_firm_id: this.selectedFirmId,
      invoice_layout_settings: this.invoiceSettings
    };

    this.customizeService.saveUserSettings(payload).subscribe({
      next: () => {
        this.notificationService.showSuccess('Invoice layout saved successfully!', 'Success');
        this.closeEditor();
      },
      error: (err) => {
        console.error('Failed to save settings', err);
        this.notificationService.showError('Failed to save invoice layout.', 'Error');
      }
    });
  }

  // --- NEW METHOD ---
  resetLayoutSettings(): void {
    if (confirm('Are you sure you want to reset all layout settings to their default values? This cannot be undone.')) {
        this.invoiceSettings = this.getDefaultSettings();
        this.notificationService.showInfo('Settings have been reset. Click "Save" to apply changes.', 'Reset');
    }
  }

  openEditor(element: StyleSetting | LabelSetting, label: string, event: MouseEvent): void {
    event.stopPropagation();
    this.activeEditor = element;
    this.activeEditorLabel = label;
  }

  closeEditor(): void {
    this.activeEditor = null;
  }

  onFileSelected(event: Event, targetSetting: { url: string }): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        targetSetting.url = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  deepMerge(target: any, source: any): any {
    const isObject = (obj: any) => obj && typeof obj === 'object' && !Array.isArray(obj);
    let result = { ...target };

    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
            if (Array.isArray(source[key])) {
                 result[key] = source[key]; // Overwrite arrays instead of merging
            } else {
                if (!(key in target)) {
                    Object.assign(result, { [key]: source[key] });
                } else {
                    result[key] = this.deepMerge(target[key], source[key]);
                }
            }
        } else {
          Object.assign(result, { [key]: source[key] });
        }
      }
    }
    return result;
  }
}
