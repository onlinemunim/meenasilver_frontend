export interface PaymentDetails {
  bank_details: string;
  bank_account_no: string;
  bank_ifsc_code: string;
  declaration: string;
  aggrid: string;
  aggrid_name: string;
  user_id: number;
  urn: string;
  api_key: string;
  corpid: string;
  alias_id: string;
  firm_id: number;
}

export interface SMTPDetails {
  email_id: string;
  email_id_cc: string;
  server: string;
  email_password: string;
  email_id_bcc?: string;
  port: number;
}

export interface EInvoiceDetails {
  api_id: string;
  username: string;
  api_key: string;
  password: string;
}

export interface SocialLinks {
  whatsapp_link: string;
  instagram_link: string;
  facebook_link: string;
}


export interface FirmOtherDetails {
  paymentDetails: PaymentDetails;
  smtpDetails: SMTPDetails;
  eInvoiceDetails: EInvoiceDetails;
  socialLinks: SocialLinks;
}
