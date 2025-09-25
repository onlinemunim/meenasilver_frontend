import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RateListGeneratorService } from '../../../../Services/Rate_List_Generator/rate-list-generator.service';
import { NgFor, NgIf } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-rate-list-invoice',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './rate-list-invoice.component.html',
  styleUrl: './rate-list-invoice.component.css'
})
export class RateListInvoiceComponent implements OnInit {
  rateList: any[] = [];
  categories: string[] = [];
  categoryWiseItems: { [key: string]: any[] } = {};
  categoryFooter: { [key: string]: { label: string; value: string } } = {}; // ✅ new

  constructor(
    private route: ActivatedRoute,
    private rateListGeneratorService: RateListGeneratorService
  ) {}

  ngOnInit(): void {
    const ids = this.route.snapshot.paramMap.get('id'); // e.g. "1,2,3"

    if (ids) {
      const idArray = ids.split(',').map(x => +x);

      const requests = idArray.map(id =>
        this.rateListGeneratorService.getRateListById(id)
      );

      forkJoin(requests).subscribe((responses: any[]) => {
        // Merge all results into one array
        this.rateList = responses.flatMap(res =>
          Array.isArray(res.data) ? res.data : [res.data]
        );

        console.log('Final Merged Rate List:', this.rateList);

        // Build categories
        this.categories = [
          ...new Set(this.rateList.map((x: any) => x.rlg_product_category))
        ];

        this.categories.forEach(category => {
          this.categoryWiseItems[category] = this.rateList.filter(
            (x: any) => x.rlg_product_category === category
          );

          // ✅ capture special "Below on MRP" footer
          const belowRule = this.categoryWiseItems[category].find(
            (x: any) =>
              x.rlg_unit === 'By MRP' &&
              (x.rlg_below ?? '').toString().trim().toLowerCase() === 'yes'
          );

          if (belowRule) {
            this.categoryFooter[category] = {
              label: `Below ${belowRule.rlg_min_weight_range} On MRP`,
              value: `${belowRule.rlg_discount}% Off On MRP`
            };

            // Optionally remove it from main list so it won’t render twice
            this.categoryWiseItems[category] =
              this.categoryWiseItems[category].filter(x => x !== belowRule);
          }
        });

        setTimeout(() => window.print(), 500);
      });
    }
  }

  printInvoice(): void {
    window.print();
  }


  formatWeightRange(item: any): string {
    console.log(
      `ID=${item.rlg_id}, min=${item.rlg_min_weight_range}, max=${item.rlg_max_weight_range}, above=${item.rlg_above}, below=${item.rlg_below}, custom=${item.rlg_weight_range}`
    );
  
    const above = (item.rlg_above ?? '').toString().trim().toLowerCase();
    const below = (item.rlg_below ?? '').toString().trim().toLowerCase();
    
    // Case 1: Max + Above
    if (item.rlg_max_weight_range != null && above === 'yes') {
      return `${item.rlg_max_weight_range} Or Above`;
    }

    // Case 2: Min–Max
    if (item.rlg_min_weight_range != null && item.rlg_max_weight_range != null) {
      return `${item.rlg_min_weight_range} - ${item.rlg_max_weight_range}`;
    }

    // Case 3: Min + Above
    if (item.rlg_min_weight_range != null && above === 'yes') {
      return `${item.rlg_min_weight_range} Or Above`;
    }

    // Case 4: Below
    if (item.rlg_min_weight_range != null && below === 'yes') {
      return `Below ${item.rlg_min_weight_range}`;
    }

    // Case 5: Custom (only if nothing else matched)
    if (
      !item.rlg_min_weight_range &&
      !item.rlg_max_weight_range &&
      above !== 'yes' &&
      below !== 'yes' &&
      item.rlg_weight_range
    ) {
      return item.rlg_weight_range;
    }
    return '-';
  }


}
