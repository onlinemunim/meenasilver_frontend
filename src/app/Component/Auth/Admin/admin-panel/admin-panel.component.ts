import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../../../../Services/notification.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { NavbarService } from '../../../../Services/navbar.service';
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryService } from '../../../../Services/Category/category.service';
import { AdminSettingsService } from '../../../../Services/Admin_Settings/admin-settings.service';
import { AssemblyBrandsService } from '../../../../Services/Assembly-Brands/assembly-brands.service';

@Component({
  selector: 'app-admin-panel',
  imports: [NgFor, NgIf, FormsModule, NgClass, RouterLink, ReactiveFormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit{

  submenuGroups: any[] = [];
  mainMenuItems: any[] = [];
  brandList:any[] = [];
  prefixForm!: FormGroup;
  adminPanelForm!:FormGroup;
  selectedFirmId!: number;
  newCategoryName: string = '';
  newGroupName: string = '';
  newBrandName: string = '';
  MRP!: any;
  loginType: 'main' | 'simple' = 'main';
  newUnit: string = '';
  newType: string = '';
  activeTab: string = 'brand';

  constructor(
    private navbarService: NavbarService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private firmSelectionService: FirmSelectionService,
    private customizeService: CustomizeService,
    private categoryService:CategoryService,
    private adminSettingsService:AdminSettingsService,
    private assemblyBrandService:AssemblyBrandsService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getAdminSetting();
    this.getBrands();

    this.navbarService.navbarOptions$.subscribe(options => {
      this.submenuGroups = options
        .filter(opt => opt.submenu)
        .map(opt => ({
          parentPath: opt.path,
          parentLabel: opt.lable,
          submenu: opt.submenu
        }));

      this.mainMenuItems = this.navbarService.getMainMenuItems();
    });

    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      if (firm?.id) {
        this.selectedFirmId = firm.id;
        this.loadUserSettings();
      }
    });
  }

  initForm() {
    this.prefixForm = this.fb.group({
      customize_metal_prefix: [''],
      customize_stone_prefix: [''],
      customize_ready_product_prefix: [''],
      customize_barcode_prefix: [''],
    });
  }
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }


  saveLoginType(){
    this.adminSettingsService.createAdminSettings({login_type:this.loginType}).subscribe({
      next:()=>{
        this.notificationService.showSuccess('Login type saved successfully!','Success');
      },
      error:(err)=>{
        console.error('Failed to save login type',err);
        this.notificationService.showError('Failed to save login type. Please try again.','Error');
      }
    });
  }

  getAdminSetting(){
    this.adminSettingsService.getAdminSettings().subscribe((response:any)=>{
      const data = response.data[0];

      if (data && data.login_type) {
        this.loginType = data.login_type;
      }
    })
  }

  loadUserSettings(): void {
    if (!this.selectedFirmId) return;

    this.customizeService.getUserSettings(this.selectedFirmId).subscribe({
      next: (response) => {
        const settings = response.data;
        if (settings && Object.keys(settings).length > 0) {
          this.prefixForm.patchValue({
            customize_metal_prefix: settings.customize_metal_prefix || '',
            customize_stone_prefix: settings.customize_stone_prefix || '',
            customize_ready_product_prefix: settings.customize_ready_product_prefix || '',
            customize_barcode_prefix: settings.customize_barcode_prefix || '',
          });

          const visibilityMap = settings.submenu_visibility || {};
          const mainMenuVisibilityMap = settings.mainmenu_visibility || {};

          // Apply submenu visibility
          if (visibilityMap) {
            this.submenuGroups.forEach(group => {
              group.submenu.forEach((item: any) => {
                const key = `${group.parentPath}_${item.path}`;
                if (visibilityMap.hasOwnProperty(key)) {
                  item.visible = visibilityMap[key];
                }
              });
            });
            this.navbarService.setAllVisibilities(visibilityMap);
          }

          // Apply main menu visibility using composite key
          this.mainMenuItems.forEach(menu => {
            const key = `${menu.path}_${menu.lable.replace(/\s+/g, '_').toLowerCase()}`;
            if (mainMenuVisibilityMap.hasOwnProperty(key)) {
              menu.visible = mainMenuVisibilityMap[key];
            }
          });
        }
      },
      error: (err) => {
        console.error('Failed to load user settings', err);
        this.notificationService.showError('Could not load your custom settings.', 'Error');
      }
    });
  }

  toggleSubItem(path: string, parentPath: string): void {
    this.navbarService.toggleVisibility(path, true, parentPath);
  }

  saveAllChanges() {
    if (!this.selectedFirmId) {
      this.notificationService.showError('Firm not selected. Cannot save settings.', 'Error');
      return;
    }

    const visibilityMap: { [key: string]: boolean } = {};
    this.navbarService.getOptions().forEach(group => {
      if (group.submenu) {
        group.submenu.forEach((item: any) => {
          const key = `${group.path}_${item.path}`;
          visibilityMap[key] = item.visible;
        });
      }
    });

    const parentVisibilityMap: { [key: string]: boolean } = {};
    this.mainMenuItems.forEach(menu => {
      const key = `${menu.path}_${menu.lable.replace(/\s+/g, '_').toLowerCase()}`;
      parentVisibilityMap[key] = menu.visible;
    });

    parentVisibilityMap['/home_home'] = true;
    parentVisibilityMap['/dropdown-settings_settings'] = true;

    const settingsPayload = {
      ...this.prefixForm.value,
      customize_firm_id: this.selectedFirmId,
      submenu_visibility: visibilityMap,
      mainmenu_visibility: parentVisibilityMap,
    };

    this.customizeService.saveUserSettings(settingsPayload).subscribe({
      next: () => {
        this.navbarService.setAllVisibilities(visibilityMap);
        this.notificationService.showSuccess('Settings saved successfully!', 'Success');
      },
      error: (err) => {
        console.error('Failed to save settings', err);
        this.notificationService.showError('Failed to save settings. Please try again.', 'Error');
      }
    });
  }

  selectAllSubmenu() {
    this.submenuGroups.forEach(group =>
      group.submenu.forEach((item: any) => {
        if (!item.visible) {
          this.navbarService.toggleVisibility(item.path, true, group.parentPath);
        }
      })
    );
  }

  unselectAllSubmenu() {
    this.submenuGroups.forEach(group =>
      group.submenu.forEach((item: any) => {
        if (item.visible) {
          this.navbarService.toggleVisibility(item.path, true, group.parentPath);
        }
      })
    );
  }

  selectAllMainMenu() {
    this.mainMenuItems.forEach(item => {
      if (item.path !== '/home' && item.path !== '/dropdown-settings') {
        item.visible = true;
      }
    });
  }

  unselectAllMainMenu() {
    this.mainMenuItems.forEach(item => {
      if (item.path !== '/home' && item.path !== '/dropdown-settings') {
        item.visible = false;
      }
    });
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      const target = keyboardEvent.target as HTMLElement;
      const form = target.closest('form');
      if (!form) return;
      const focusable = Array.from(
        form.querySelectorAll<HTMLElement>('input, select, textarea, button')
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);
      const index = focusable.indexOf(target);
      if (index > -1 && index + 1 < focusable.length) {
        focusable[index + 1].focus();
      }
    }
  }


   addCategory() {
    const name = this.newCategoryName?.trim();
    const group = this.newGroupName?.trim();
    const unit = this.newUnit;
    const mrp = this.MRP?.trim();

    if (!name || !group || !mrp) {
      this.notificationService.showError('Category, Group and MRP cannot be empty.', 'Add Category');
      return;
    }

    if (!this.selectedFirmId) {
      this.notificationService.showError('Firm not selected. Cannot add category.', 'Add Category');
      return;
    }

    const payload = { name, group, unit, mrp, firm_id: this.selectedFirmId };

    this.categoryService.createCategory(payload).subscribe({
      next: () => {
        this.notificationService.showSuccess(`Category "${name}" added successfully.`, 'Add Category');
        this.newCategoryName = '';
        this.newGroupName = '';
        this.newUnit = '';
        this.MRP = '';
      },
      error: (err) => {
        this.notificationService.showError('Failed to save category.', 'Add Category');
        console.error('Add category error:', err);
      }
    });
  }


  saveBrandName(){
    const payload = {
      assembly_brand_name : this.newBrandName
    };

    this.assemblyBrandService.createAssemblyBrand(payload).subscribe({
      next:()=>{
        this.notificationService.showSuccess(`Brand "${this.newBrandName}" added successfully.`, 'success');
        this.newBrandName = '';
        // this.navbarService.getBrands();
        this.getBrands();
      },
      error:(err)=>{
        this.notificationService.showError('Failed to save brand.', 'Add Brand');
        console.error('Add brand error:', err);
      }
    })
  }

  getBrands(){
    this.assemblyBrandService.getAssemblyBrands().subscribe({
      next:(response:any)=>{
        this.brandList = response.data;
      },
      error:(err)=>{
        console.error('Fetch brands error:', err);
      }
    })
  }

  deleteBrang(id:any){
    this.assemblyBrandService.deleteAssemblyBrand(id).subscribe({
      next:()=>{
        this.notificationService.showSuccess(`Brand Deleted successfully.`, 'success');
        // this.navbarService.getBrands();
        this.getBrands();
      },
      error:(err)=>{
        this.notificationService.showError('Failed to Delete brand.', 'Delete Brand');
        console.error('Delete brand error:', err);
      }
    })
  }
}
