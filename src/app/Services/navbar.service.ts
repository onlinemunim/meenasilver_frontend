import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AssemblyBrandsService } from './Assembly-Brands/assembly-brands.service';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  brandList: any[] = [];
  private navBarOptions = [
    { path: '/home', lable: 'Home', visible: true,
      submenu:[
        { path: '/rate-list-generator', lable: 'Rate List Generator', visible: true },
        { path: '/add-category', lable: 'Add New Category', visible: true }
      ]
    },
    {
      path: '/add-ready-product',
      lable: 'Ready Product Line',
      visible: true,
      submenu: [
        { path: '/add-stock/add-retail-fine-stock-b1', lable: 'Add Fine Stock', visible: false },
        { path: '/add-ready-product', lable: 'Add Ready Product', visible: true },
      ]
    },
    {
      path: '/raw-metal/metal',
      lable: 'Assembly Line',
      visible: true,
      submenu: [
        {
          path: '/product-creation',
          lable: this.brandList?.[0]?.assembly_brand_name,
          visible: true,
          submenu: [
            { path: '/product-creation', lable: 'Create Product', visible: true },
            { path: '/raw-metal/metal', lable: 'Add Raw Material', visible: true },
            { path: '/orders-creation', lable: 'Order Creation', visible: true },
            { path: '/design-product', lable: 'Designed Product List', visible: true },
            { path: '/available-to-produce', lable: 'Available To Produce (ATP)', visible: true },
            { path: '/material-requirement-sheet', lable: 'Material Requirement Sheet (MRS)', visible: true },
            { path: '/combo-creation', lable: 'Combo Creation', visible: true },
          ]
        },
      ]
    },
    {
      path: '/packaging-form',
      lable: 'Packaging',
      visible: true,
      submenu: [
        { path: '/packaging-form', lable: 'New Packaging Entry', visible: true},
        { path: '/packaging-stack-form', lable: 'Create Packaging Stack', visible: true},
      ]
     },
     {
      path: '/product-tagging',
      lable: 'Tag',
      visible: true,
      submenu: [
        { path: '/product-tagging', lable: 'Product Tagging', visible: true},
        { path: '/taggings-list', lable: 'Taggings list', visible: true, key: 'taggings_list' },
        { path: '/tag-labels', lable: 'Tag Label', visible: true},
      ]
     },
    {
      path: '/report',
      lable: 'Report',
      visible: true,
      submenu: [
        { path: '/report/fine-jewellery', lable: 'Fine Jewellery', visible: true, key: 'fine_jewellery' },
        { path: '/report/imitation-jewellery', lable: 'Imitation Jewellery', visible: true, key: 'imitation_jewelry' },
        { path: '/report/raw-metal', lable: 'Raw Metal', visible: true, key: 'raw_metal' },
        { path: '/report/raw-metal-stock', lable: 'Raw Metal', visible: true, key: 'raw_metal_stock' },
        { path: '/report/stone-stock', lable: 'Raw Stone', visible: true, key: 'stone_stock' },
        { path: '/report/stock-tally', lable: 'Stock Tally', visible: false, key: 'stock_tally' },
        { path: '/report/ready-product-list', lable: 'Ready Product List', visible: true, key: 'ready_product_stock' },
        { path: '/report/reorder-list', lable: 'Re-Order List', visible: false, key: 'reorder_list' },
        { path: '/report/stock-ins', lable: 'Stocks', visible: true, key: 'stock_ins' },
        { path: '/report/stock-list', lable: 'Stocks List', visible: true, key: 'stock_list' },
        { path: '/report/other-panel', lable: 'Other Panel', visible: true, key: 'other_panel'},
        { path: '/report/stock-packaging-list', lable: 'Stock Packaging list', visible: true, key: 'stock_packaging_list' },
      ]
    },
    { path: '/sell-customer', lable: 'Sell', visible: true },
    { path: '/#', lable: 'Scheme', visible: false },
    { path: '/#', lable: 'Loan', visible: false },
    { path: '/#', lable: 'Cr/Dr', visible: false },
    { path: '/#', lable: 'Expense', visible: false },
    {
      path: '/user-list',
      lable: 'User List',
      visible: true,
      submenu: [
        { path: '/user-list/customer-list', lable: 'Customer List', visible: true },
        { path: '/user-list/staff-list', lable: 'Staff List', visible: true },
        { path: '/user-list/supplier-list', lable: 'Supplier List', visible: true },
        { path: '/user-list/investor-list', lable: 'Investor List', visible: true },
        { path: '/create-user/add-customer', lable: 'Add Customer', visible: true },
        { path: '/create-user/add-staff', lable: 'Add Staff', visible: true },
        { path: '/create-user/add-supplier', lable: 'Add Supplier', visible: true },
        { path: '/create-user/add-investor', lable: 'Add Investor', visible: true },
      ]
    },
    { path: '/kalakaar-management', lable: 'Kalakaar', visible: true },
    { path: '/admin-panel', lable: 'Settings', visible: true }
  ];

  private navbarOptionsSubject = new BehaviorSubject<any[]>(this.navBarOptions);
  navbarOptions$ = this.navbarOptionsSubject.asObservable();

  // BehaviorSubject for Report Tab visibility
  private reportTabVisibilitySubject = new BehaviorSubject<Record<string, boolean>>(this.getInitialReportTabVisibility());
  reportTabVisibility$ = this.reportTabVisibilitySubject.asObservable();

  constructor(private assemblyBrandsService: AssemblyBrandsService) {
    this.getBrands();
    this.updateSettingsVisibility();
  }

  getOptions() {
    return this.navbarOptionsSubject.value;
  }

  private getInitialReportTabVisibility(): Record<string, boolean> {
    const reportMenu = this.navBarOptions.find(opt => opt.path === '/report');
    const visibilityMap: Record<string, boolean> = {};
    if (reportMenu?.submenu) {
      reportMenu.submenu.forEach((item: any) => {
        if (item.key) {
          visibilityMap[item.key] = item.visible;
        }
      });
    }
    return visibilityMap;
  }

  public getMainMenuItems(): any[] {
    return this.getOptions().filter(item => item.path !== '/dropdown-settings');
  }

  toggleVisibility(path: string, isSub: boolean = false, parentPath?: string) {
    const options = this.getOptions();
    if (isSub && parentPath) {
      const parent = options.find(opt => opt.path === parentPath);
      if (parent?.submenu) {
        const subItem = parent.submenu.find((sub: any) => sub.path === path);
        if (subItem) subItem.visible = !subItem.visible;
        if (parent.path === '/report' && subItem.key) {
          const currentReportVisibility = this.reportTabVisibilitySubject.value;
          currentReportVisibility[subItem.key] = subItem.visible;
          this.reportTabVisibilitySubject.next({ ...currentReportVisibility });
        }
      }
    } else {
      const item = options.find(opt => opt.path === path);
      if (item) item.visible = !item.visible;
    }
    this.navbarOptionsSubject.next(options);
  }

  getSubMenuItems(): any[] {
    return JSON.parse(JSON.stringify(
      this.getOptions()
        .filter(opt => opt.submenu)
        .map(opt => ({
          parentPath: opt.path,
          parentLabel: opt.lable,
          parentVisible: opt.visible,
          submenu: opt.submenu
        }))
    ));
  }

  public setAllVisibilities(visibilityMap: { [key: string]: boolean }): void {
    const currentOptions = this.getOptions();
    const newReportTabVisibility: Record<string, boolean> = {};

    currentOptions.forEach(parent => {
      if (parent.submenu) {
        parent.submenu.forEach((item: any) => {
          const key = `${parent.path}_${item.path}`;
          if (visibilityMap.hasOwnProperty(key)) {
            item.visible = visibilityMap[key];
          }
          if (parent.path === '/report' && item.key) {
            newReportTabVisibility[item.key] = item.visible;
          }
        });
      }
    });

    this.navbarOptionsSubject.next(currentOptions);
    this.reportTabVisibilitySubject.next(newReportTabVisibility);
  }

  public setReportTabVisibilities(updatedVisibilityMap: Record<string, boolean>): void {
    this.reportTabVisibilitySubject.next(updatedVisibilityMap);
  }

  public setMainMenuVisibilities(mainMenuVisibilityMap: { [key: string]: boolean }): void {
    const currentOptions = this.getOptions();
    currentOptions.forEach(menu => {
      const key = `${menu.path}_${menu.lable.replace(/\s+/g, '_').toLowerCase()}`;
      if (mainMenuVisibilityMap.hasOwnProperty(key)) {
        menu.visible = mainMenuVisibilityMap[key];
      }
    });
    this.navbarOptionsSubject.next(currentOptions);
  }

  updateSettingsVisibility() {
    const userType = localStorage.getItem('user_type');
    this.navBarOptions.forEach(option => {
      if (option.path === '/admin-panel') {
        option.visible = userType === 'Owner';
      }
      if (option.path === '/dropdown-settings') {
        option.visible = userType === 'Owner';
      }
    });
    this.navbarOptionsSubject.next(this.navBarOptions);
  }

  getBrands() {
    this.assemblyBrandsService.getAssemblyBrands().subscribe({
      next: (response: any) => {
        this.brandList = response.data;
        console.log("in navbar ", this.brandList);

        const options = this.getOptions();
        const assemblyMenu = options.find(opt => opt.path === '/raw-metal/metal');

        if (assemblyMenu) {
          assemblyMenu.submenu = [
            {
              path: '/assembly-brand',
              lable: 'Add New Brand',
              visible: true
            },
            ...this.brandList.map((brand: any) => ({
              path: '/assembly-container/' + brand.id,
              lable: brand.assembly_brand_name,
              visible: true
            }))
          ];
        }
        this.navbarOptionsSubject.next([...options]);
      },
      error: (err) => {
        console.error('Fetch brands error:', err);
      }
    });
  }
}
