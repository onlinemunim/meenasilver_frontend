import { NgClass, NgIf } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarService } from '../../../../Services/navbar.service';

@Component({
  selector: 'app-create-report',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NgIf, NgClass],
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.css']
})

export class CreateReportComponent implements OnInit,OnDestroy {
  constructor(private router: Router,private navbarService: NavbarService) {}

  fine_jewellery: boolean = false;
  imitation_jewelry: boolean = false;
  raw_metal_stock: boolean = true;
  stone_stock: boolean = true;
  ready_product_stock: boolean = true;
  stock_tally: boolean = false;
  reorder_list: boolean = false;
  stock_ins: boolean = true;
  stock_packaging_list: boolean = true;
  other_panel: boolean = false;
  showStocksDropdown = false;
  @ViewChild('stocksDropdownContainer') dropdownRef!: ElementRef;
  private subscriptions: Subscription = new Subscription();
  tabVisibility: Record<string, boolean> = {};

  ngOnInit(): void {
    document.addEventListener('click', this.onClickOutside, true);
    this.subscriptions.add(
      this.navbarService.reportTabVisibility$.subscribe(visibility => {
        this.tabVisibility = { ...visibility };
      })
    );
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onClickOutside, true);
    this.subscriptions.unsubscribe();
  }

  /**
   * Generic function for simple tabs where the sub-routes match the base path.
   * @param basePath The base route for the tab.
   */
  isTabActive(basePath: string): boolean {
    return this.router.url.startsWith(basePath);
  }

  /**
   * NEW/UPDATED: Keeps the "Fine Jewellery" tab active for its main page
   * AND for the new gold/silver stock page.
   */
  isFineJewelleryActive(): boolean {
    const fineJewelleryRoutes = [
      '/report/fine-jewellery',
      '/report/gold-silver-stock', // Add the new route here!
      '/report/gold-stock',
      '/report/silver-stock',
      '/report/jewellery-panel-list',
      '/report/wholesale-search-list',
      '/report/sold-out-stock-list',
      '/report/sold-out-stock-list2-list',
      '/report/retail-stock-list-list',
      '/report/purchase-stock-category-list-list',
      '/report/purchase-stock-list-list',
    ];
    return fineJewelleryRoutes.some(route => this.router.url.startsWith(route));
  }

  /**
   * Keeps the "Raw Metal" tab active for its list of related routes.
   */
  isRawMetalActive(): boolean {
    const rawMaterialRoutes = [
      '/report/raw-metal',
      '/report/raw-metal-stock',
      '/report/stone-stock'
    ];
    return rawMaterialRoutes.some(route => this.router.url.startsWith(route));
  }

  /**
   * Keeps the "Stocks" dropdown button highlighted when any of its child links are active.
   */
  isStocksActive(): boolean {
    const stocksRoutes = [
      '/report/stock-ins',
      '/report/stock-outs',
      '/report/stock-list'
    ];
    return stocksRoutes.some(route => this.router.url.startsWith(route));
  }

  // --- Dropdown Logic (remains unchanged) ---
  onClickOutside = (event: MouseEvent) => {
    if (this.showStocksDropdown && this.dropdownRef && !this.dropdownRef.nativeElement.contains(event.target)) {
        this.showStocksDropdown = false;
    }
  };

  toggleDropdown() {
    this.showStocksDropdown = !this.showStocksDropdown;
  }

  closeDropdown() {
    this.showStocksDropdown = false;
  }
}





























// import { NgClass, NgIf } from '@angular/common';
// import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// import { Subscription } from 'rxjs';
// import { NavbarService } from '../../../../Services/navbar.service';

// @Component({
//   selector: 'app-create-report',
//   standalone: true,
//   imports: [RouterLink, RouterLinkActive, RouterOutlet,NgIf,NgClass],
//   templateUrl: './create-report.component.html',
//   styleUrl: './create-report.component.css'
// })
// export class CreateReportComponent implements OnInit {
//   constructor(private router: Router,private navbarService: NavbarService) {}

//   fine_jewellery: boolean = true;
//   imitation_jewelry: boolean = true;
//   raw_metal: boolean = true;
//   raw_metal_stock: boolean = true;
//   stone_stock: boolean = true;
//   ready_product_stock: boolean = true;
//   stock_tally: boolean = true;
//   reorder_list: boolean = true;
//   stock_ins: boolean = true;
//   stock_packaging_list: boolean = true;
//   other_panel: boolean = true;

//   showStocksDropdown = false;

//   showStockReportsDropdown = false;
//   isDropdownOpen = false;

//   @ViewChild('stocksDropdownContainer') dropdownRef!: ElementRef;
//   private subscriptions: Subscription = new Subscription();

//  tabVisibility: Record<string, boolean> = {};
// //  pathToKeyMap: Record<string, keyof CreateReportComponent> = {
// //   '/report/fine-jewellery': 'fine_jewellery',
// //   '/report/imitation-jewellery': 'imitation_jewelry',
// //   '/report/raw-metal-stock': 'raw_metal_stock',
// //   '/report/stone-stock': 'stone_stock',
// //   '/report/ready-product-list': 'ready_product_stock',
// //   '/report/stock-tally': 'stock_tally',
// //   '/report/stock-ins': 'stock_ins',
// //   '/report/reorder-list': 'reorder_list',
// //   '/report/other-panel': 'other_panel',
// //   '/report/stock-packaging-list': 'stock_packaging_list',
// // };


// ngOnInit(): void {
//   document.addEventListener('click', this.onClickOutside, true);

//   this.subscriptions.add(
//     this.navbarService.reportTabVisibility$.subscribe(visibility => {
//       this.tabVisibility = { ...visibility };
//     })
//   );

// }
// // isRawMetalActive(): boolean {
// //   const currentUrl = this.router.url;
// //   // Yeh check karega ki URL '/report/raw-metal' ya '/report/raw-metal-stock' hai ya nahi
// //   // Isse 'Raw Metal' tab dono case mein active rahega
// //   return currentUrl.startsWith('/report/raw-metal') || currentUrl.startsWith('/report/raw-metal-stock');
// // }

// // create-report.component.ts file mein yeh function update karein

// isRawMetalActive(): boolean {
//   // Is list mein hum woh saare routes daal denge jin par 'Raw Metal' tab ko active rakhna hai.
//   const rawMaterialRoutes = [
//     '/report/raw-metal',
//     '/report/raw-metal-stock',
//     '/report/stone-stock' // Naya 'Stone Stock' ka route yahan add kiya gaya hai
//     // Agar kal ko 'Thread Stock' ya 'Beads Stock' jaisa kuch aaye, to use bhi yahin add kar dein.
//   ];

//   const currentUrl = this.router.url;

//   // Logic wahi rahega: Yeh check karega ki current URL upar di gayi list ke kisi bhi item se match karta hai ya nahi.
//   return rawMaterialRoutes.some(route => currentUrl.startsWith(route));
// }


// ngOnDestroy(): void {
//   document.removeEventListener('click', this.onClickOutside, true);
//   this.subscriptions.unsubscribe();
// }


// onClickOutside = (event: MouseEvent) => {
//   if (this.showStocksDropdown && this.dropdownRef) {
//     const clickedInside = this.dropdownRef.nativeElement.contains(event.target);
//     if (!clickedInside) {
//       this.showStocksDropdown = false;
//     }
//   }
// };

// toggleDropdown(type: 'stocks' | 'reports') {
//   if (type === 'stocks') {
//     this.showStocksDropdown = !this.showStocksDropdown;
//     this.showStockReportsDropdown = false;
//   } else if (type === 'reports') {
//     this.showStockReportsDropdown = !this.showStockReportsDropdown;
//     this.showStocksDropdown = false;
//   }
// }

// closeDropdown(type: 'stocks' | 'reports') {
//   if (type === 'stocks') this.showStocksDropdown = false;
//   if (type === 'reports') this.showStockReportsDropdown = false;
// }

// handleDropdownBlur() {
//   setTimeout(() => {
//     this.showStocksDropdown = false;
//     this.showStockReportsDropdown = false;
//   }, 100);
// }

// navigateTo(path: string) {
//   setTimeout(() => {
//     this.showStocksDropdown = false;
//     this.router.navigateByUrl(path);
//   }, 50);
// }
// }
