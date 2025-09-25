import { Component, Input } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';

interface SupplierDocument {
  id: number;
  doc_user_img?: string;
}

interface Supplier {
  id: number;
  name: string;
  user_last_name: string;
  mobilenumber: string;
  user_supplier_type: string;
  gstnumber: string;
  city_id: number;
  email: string;
  user_dob: string;
  blood_group: string;
  doc_user_img?: string;
  documents?: SupplierDocument[];
}

@Component({
  selector: 'app-personal-details',
  imports: [NgIf],
  templateUrl: './personal-details.component.html',
  styleUrl: './personal-details.component.css'
})
export class PersonalDetailsComponent {

  @Input() userKalakarData: Supplier[] = [];

}
