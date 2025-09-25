import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RateListGeneratorService } from '../../../../Services/Rate_List_Generator/rate-list-generator.service';
import { NgFor } from '@angular/common';
import { NotificationService } from './../../../../Services/notification.service';
import { Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-generated-ratelist',
  standalone: true,
  imports: [NgFor,RouterLink],
  templateUrl: './generated-ratelist.component.html',
  styleUrl: './generated-ratelist.component.css'
})
export class GeneratedRatelistComponent implements OnInit{
  RateListGeneratorList: any;



  constructor(private rateListGeneratorService:RateListGeneratorService,
    private NotificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    initFlowbite();
    this.getRateList();
  }

  getRateList() {
    let params = new HttpParams();
    this.rateListGeneratorService.getRateList(params).subscribe(
      (res: any) => {
        // reverse the data array
        this.RateListGeneratorList = res.data.reverse();
        console.log('Rate List (Reversed):', this.RateListGeneratorList);
      },
      (error: any) => {
        console.error('Error fetching rate list:', error);
      }
    );
  }

  onPrintinvoiceClick() {
      if (!this.RateListGeneratorList || this.RateListGeneratorList.length === 0) {
        this.NotificationService.showError('No rate lists available to print.', 'Error');
        return;
      }

      // Collect all IDs
      const ids = this.RateListGeneratorList.map((x: any) => x.rlg_id).join(',');

      this.openPrintView(ids);
    }

    openPrintView(ids: string) {
      this.router.navigate(['/rate-list/print', ids]);
    }


}
