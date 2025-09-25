import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../Services/notification.service';
import { FirmService } from '../../../Services/firm.service';
import { forkJoin, of, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-firm-other',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './firm-other.component.html',
  styleUrls: ['./firm-other.component.css'],
})
export class FirmOtherComponent implements OnInit {
  mainForm!: FormGroup;
  firmId: number | null = null;
  isEditMode = false;

  private paymentDetailsId: number | null = null;
  private smtpDetailsId: number | null = null;
  private eInvoiceDetailsId: number | null = null;
  private socialLinksId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private firmService: FirmService,
    private router: Router,
    public notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    this.initMainForm();

    // Subscribe to the paramMap Observable. This is the key to reacting to URL changes.
    // It will fire every time the route parameter (e.g., the 'id') changes.
    this.route.paramMap.subscribe(params => {
      const routeParamId = params.get('id');

      if (routeParamId) {
        // --- EDIT MODE ---
        // This block runs when an 'id' is present in the URL (e.g., /firm/1/edit).
        this.isEditMode = true;
        const id = +routeParamId; // Use '+' to convert the string param to a number
        this.firmId = id;

        // Reset IDs to null before loading new data to prevent stale state
        this.paymentDetailsId = null;
        this.smtpDetailsId = null;
        this.eInvoiceDetailsId = null;
        this.socialLinksId = null;

        this.firmService.setFirmId(id);
        this.setFirmIdInForms(id);
        this.loadExistingData(id);
      } else {
        // --- CREATE MODE ---
        // This block runs when there's no 'id' in the URL (e.g., /firm-create).
        this.isEditMode = false;
        this.firmService.firmId$.subscribe((idFromService) => {
          if (idFromService) {
            this.firmId = idFromService;
            this.setFirmIdInForms(idFromService);
          }
        });
      }
    });
  }

  initMainForm() {
    this.mainForm = this.fb.group({
      paymentDetails: this.fb.group({
        bank_details: ['', [Validators.required, Validators.maxLength(100)]],
        bank_account_no: ['', [Validators.required, Validators.maxLength(100)]],
        bank_ifsc_code: ['', [Validators.required, Validators.maxLength(100)]],
        declaration: ['', [Validators.required, Validators.maxLength(100)]],
        aggrid: ['', [Validators.required, Validators.maxLength(100)]],
        aggrid_name: ['', [Validators.required, Validators.maxLength(100)]],
        user_id: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
        urn: ['', [Validators.required, Validators.maxLength(100)]],
        api_key: ['', [Validators.required, Validators.maxLength(100)]],
        corpid: ['', [Validators.required, Validators.maxLength(100)]],
        alias_id: ['', [Validators.required, Validators.maxLength(100)]],
        firm_id: [null, [Validators.required]],
      }),
      smtpDetails: this.fb.group({
        email_id: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        email_id_cc: ['', [Validators.required, Validators.maxLength(100)]],
        server: ['', [Validators.required, Validators.maxLength(100)]],
        email_password: ['', [Validators.required, Validators.maxLength(100)]],
        email_id_bcc: ['', [Validators.email, Validators.maxLength(255)]],
        port: ['', [Validators.required, Validators.min(1), Validators.max(65535)]],
        firm_id: [null, [Validators.required]],
      }),
      eInvoiceDetails: this.fb.group({
        api_id: ['', [Validators.required, Validators.maxLength(100)]],
        username: ['', [Validators.required, Validators.maxLength(100)]],
        api_key: ['', [Validators.required, Validators.maxLength(100)]],
        password: ['', [Validators.required, Validators.maxLength(100)]],
        firm_id: [null, [Validators.required]],
      }),
      socialLinks: this.fb.group({
        whatsapp_link: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('https?://.+')]],
        instagram_link: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('https?://.+')]],
        facebook_link: ['', [Validators.required, Validators.maxLength(255), Validators.pattern('https?://.+')]],
        firm_id: [null, [Validators.required]],
      }),
    });
  }

  setFirmIdInForms(firmId: number) {
    this.mainForm.get('paymentDetails.firm_id')?.setValue(firmId);
    this.mainForm.get('smtpDetails.firm_id')?.setValue(firmId);
    this.mainForm.get('eInvoiceDetails.firm_id')?.setValue(firmId);
    this.mainForm.get('socialLinks.firm_id')?.setValue(firmId);
  }

  loadExistingData(firmId: number): void {
  this.mainForm.reset();

  forkJoin({
    payment: this.firmService.getPaymentDetailsByFirmId(firmId).pipe(catchError(() => of(null))),
    smtp: this.firmService.getSmtpDetailsByFirmId(firmId).pipe(catchError(() => of(null))),
    einvoice: this.firmService.getEInvoiceDetailsByFirmId(firmId).pipe(catchError(() => of(null))),
    media: this.firmService.getSocialMediaLinksByFirmId(firmId).pipe(catchError(() => of(null))),
  }).subscribe(({ payment, smtp, einvoice, media }) => {
    if (payment && payment.data && payment.data.length > 0) {
      const paymentDetails = payment.data[0];
      this.mainForm.get('paymentDetails')?.patchValue(paymentDetails);
      this.paymentDetailsId = paymentDetails.id;
    }

    if (smtp && smtp.data && smtp.data.length > 0) {
      const smtpDetails = smtp.data[0];
      this.mainForm.get('smtpDetails')?.patchValue(smtpDetails);
      this.smtpDetailsId = smtpDetails.id;
    }

    if (einvoice && einvoice.data && einvoice.data.length > 0) {
      const einvoiceDetails = einvoice.data[0];
      this.mainForm.get('eInvoiceDetails')?.patchValue(einvoiceDetails);
      this.eInvoiceDetailsId = einvoiceDetails.id;
    }

    if (media && media.data && media.data.length > 0) {
      const mediaDetails = media.data[0];
      this.mainForm.get('socialLinks')?.patchValue(mediaDetails);
      this.socialLinksId = mediaDetails.id;
    }

    // 🔥 Ensure firm_id is always set after patching
    this.setFirmIdInForms(firmId);
  });
}

  onSubmit(): void {
    // if (this.mainForm.invalid) {
    //   this.mainForm.markAllAsTouched();
    //   this.notificationService.showError('Please fill all required fields.', 'Validation Error');
    //   return;
    // }

    if (this.isEditMode) {
      this.updateFirmDetails();
    } else {
      this.createFirmDetails();
    }
  }

  createFirmDetails(): void {
    const paymentData = this.mainForm.get('paymentDetails')?.value;
    const smtpData = this.mainForm.get('smtpDetails')?.value;
    const einvoiceData = this.mainForm.get('eInvoiceDetails')?.value;
    const mediaData = this.mainForm.get('socialLinks')?.value;

    forkJoin({
      payment: this.firmService.createPaymentDetails(paymentData),
      smtp: this.firmService.createSmtpDetails(smtpData),
      einvoice: this.firmService.createEInvoiceDetails(einvoiceData),
      media: this.firmService.createSocialMediaLinks(mediaData),
    }).subscribe({
      next: () => {
        this.notificationService.showSuccess('Firm created successfully!', 'Success');
        this.mainForm.reset();
        this.router.navigate(['/firms']);
      },
      error: (error) => {
        console.error('Error creating firm sections:', error);
        this.notificationService.showError('Failed to create firm sections.', 'Submission Error');
      },
    });
  }

  updateFirmDetails(): void {
  const observables: { [key: string]: Observable<any> } = {};

  const paymentValue = this.mainForm.get('paymentDetails')?.value;
  if (this.mainForm.get('paymentDetails')?.dirty) {
    if (this.paymentDetailsId) {
      observables['payment'] = this.firmService.updatePaymentDetails(this.paymentDetailsId, paymentValue);
    } else {
      observables['payment'] = this.firmService.createPaymentDetails(paymentValue);
    }
  }

  const smtpValue = this.mainForm.get('smtpDetails')?.value;
  if (this.mainForm.get('smtpDetails')?.dirty) {
    if (this.smtpDetailsId) {
      observables['smtp'] = this.firmService.updateSmtpDetails(this.smtpDetailsId, smtpValue);
    } else {
      observables['smtp'] = this.firmService.createSmtpDetails(smtpValue);
    }
  }

  const einvoiceValue = this.mainForm.get('eInvoiceDetails')?.value;
  if (this.mainForm.get('eInvoiceDetails')?.dirty) {
    if (this.eInvoiceDetailsId) {
      observables['einvoice'] = this.firmService.updateEInvoiceDetails(this.eInvoiceDetailsId, einvoiceValue);
    } else {
      observables['einvoice'] = this.firmService.createEInvoiceDetails(einvoiceValue);
    }
  }

  const socialValue = this.mainForm.get('socialLinks')?.value;
  if (this.mainForm.get('socialLinks')?.dirty) {
    if (this.socialLinksId) {
      observables['media'] = this.firmService.updateSocialMediaLinks(this.socialLinksId, socialValue);
    } else {
      observables['media'] = this.firmService.createSocialMediaLinks(socialValue);
    }
  }

  if (Object.keys(observables).length === 0) {
    this.notificationService.showSuccess('No changes to save.', 'Info');
    return;
  }

  forkJoin(observables).subscribe({
    next: () => {
      this.notificationService.showSuccess('Firm details saved successfully!', 'Success');
    },
    error: (error) => {
      console.error('Error saving firm sections:', error);
      this.notificationService.showError('Failed to save firm sections.', 'Submission Error');
    },
  });
}
}
