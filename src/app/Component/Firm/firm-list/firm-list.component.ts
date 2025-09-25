import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FirmService } from '../../../Services/firm.service';
import { NgFor } from '@angular/common';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-firm-list',
  imports: [NgFor, CommonModule, RouterLink],
  templateUrl: './firm-list.component.html',
  styleUrl: './firm-list.component.css'
})
export class FirmListComponent implements OnInit {

  firmsdata: any;

  constructor(private firmService: FirmService, private router: Router) { }

  firms = [
    { id: 'SK14257856', name: 'Sky Vision', type: 'Private LTD.', date: '25-03-2024' },
    { id: 'SK14257856', name: 'Sky Vision', type: 'Private LTD.', date: '25-03-2024' },
    { id: 'SK14257856', name: 'Sky Vision', type: 'Private LTD.', date: '25-03-2024' },
    { id: 'SK14257856', name: 'Sky Vision', type: 'Private LTD.', date: '25-03-2024' }
  ];

  ngOnInit(): void {
    this.getFirmsData();
  }

  getFirmsData() {
    this.firmService.getFirmsData().subscribe((response: any) => {
      this.firmsdata = response.data;

    })
  }

  openFirmDetails(id: number): void {
    this.firmService.getFirm(id).subscribe(
      (response: any) => {
        const firm = response.data;
        const address = firm.address || {};

        Swal.fire({
          title: `<strong style="font-size: 20px; color: #c19725;">Firm Details</strong>`,
          html: `
            <div style="text-align: left; font-size: 14px; max-height: 70vh; overflow-y: auto; font-family: 'Segoe UI', sans-serif;">
              <section style="margin-bottom: 1.5rem;">
                <h3 style="background: #fdf5e4; color: #c19725; padding: 6px 10px; border-left: 4px solid #c19725;">Firm Info</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 8px;">
                  <p><strong>Firm ID:</strong> ${firm.firm_shortid}</p>
                  <p><strong>Name:</strong> ${firm.name}</p>
                  <p><strong>Trade Name:</strong> ${firm.trade_name}</p>
                  <p><strong>Type:</strong> ${firm.type}</p>
                  <p><strong>Category:</strong> <span style="background: #f8e8c3; padding: 2px 6px; border-radius: 4px; color: #c19725;"><strong>${firm.category}</strong></span></p>
                  <p><strong>Description:</strong> ${firm.description || '-'}</p>
                  <p><strong>GST No:</strong> ${firm.gst_no}</p>
                  <p><strong>GST Status:</strong> <span style="color: ${firm.gst_status === 'Active' ? 'green' : 'red'};"><strong>${firm.gst_status}</strong></span></p>
                  <p><strong>Phone No:</strong> 📞 ${firm.phone_no}</p>
                  <p><strong>Email:</strong> 📧 ${firm.email}</p>
                  <p><strong>Website:</strong> 🌐 <a href="${firm.website}" target="_blank">${firm.website}</a></p>
                  <p><strong>Registration No:</strong> ${firm.registration_no}</p>
                  <p><strong>PAN No:</strong> ${firm.pan_no}</p>
                  <p><strong>CIN No:</strong> ${firm.cin_no}</p>
                  <p><strong>ICE No:</strong> ${firm.ice_no}</p>
                  <p><strong>TAN No:</strong> ${firm.tan_no}</p>
                  <p><strong>Other Info:</strong> ${firm.comments_other_info || '-'}</p>
                  <p><strong>Geo Latitude:</strong> ${firm.geo_location_latitude}</p>
                  <p><strong>Geo Longitude:</strong> ${firm.geo_location_longitude}</p>
                  <p><strong>Financial Year Start:</strong> ${firm.fin_year_start_date}</p>
                  <p><strong>Principal Amt From:</strong> ${firm.principla_amt_limit_form}</p>
                  <p><strong>Principal Amt To:</strong> ${firm.principla_amt_limit_to}</p>
                  <p><strong>Currency Code:</strong> ${firm.currency_code}</p>
                </div>
              </section>

              <section>
                <h3 style="background: #fdf5e4; color: #c19725; padding: 6px 10px; border-left: 4px solid #c19725;">Address Info</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 8px;">
                  <p><strong>Address Line 1:</strong> ${address.add1 || '-'}</p>
                  <p><strong>Pincode:</strong> ${address.pincode || '-'}</p>
                  <p><strong>City:</strong> ${address.city?.name || '-'}</p>
                  <p><strong>State:</strong> ${address.state?.name || '-'}</p>
                  <p><strong>Country:</strong> ${address.country?.name || '-'}</p>
                </div>
              </section>
            </div>
          `,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: '<span style="color: white;">Close</span>',
          width: '850px',
          scrollbarPadding: false,
          customClass: {
            popup: 'firm-details-popup',
            confirmButton: 'firm-confirm-button'
          }
        });

      },
      (error) => {
        console.error('Error fetching firm details', error);
        Swal.fire('Error', 'Unable to fetch firm details.', 'error');
      }
    );
  }




  viewFirm(id: number) {
    this.router.navigate(['/firm-view', id]);
  }


  editFirm(id: number) {
    this.router.navigate(['firm/' + id + '/edit']);
    localStorage.setItem('firmIdFromGeneral', JSON.stringify(id));
    this.firmService.setFirmId(id);
  }
  trackByFirmId(index: number, firm: any): number {
    return firm.id;
  }


  deleteFirm(id: any) {
    this.firmService.deleteFirm(id).subscribe((response: any) => {
      alert("Firm deleted successfully!");
      this.getFirmsData();
    })
  }
}
