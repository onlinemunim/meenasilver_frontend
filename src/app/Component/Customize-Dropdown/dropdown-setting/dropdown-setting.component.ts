import { Component, OnInit } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormsModule } from '@angular/forms';
import { NavbarService } from '../../../Services/navbar.service';
import { NotificationService } from '../../../Services/notification.service';
import { FirmSelectionService } from '../../../Services/firm-selection.service';
import { CustomizeService } from '../../../Services/Customize_settings/customize.service';
import { StockGeneralService } from '../../../Services/Product_Creation/stock-general.service';

@Component({
  selector: 'app-dropdown-setting',
  standalone: true,
  imports: [NgFor,FormsModule, NgClass, RouterLink, ReactiveFormsModule],
  templateUrl: './dropdown-setting.component.html',
  styleUrls: ['./dropdown-setting.component.css']
})
export class DropdownSettingComponent implements OnInit {
  submenuGroups: any[] = [];
  mainMenuItems: any[] = [];
  prefixForm!: FormGroup;
  adminPanelForm!:FormGroup;
  selectedFirmId!: number;

  constructor(
    private navbarService: NavbarService,
    private notificationService: NotificationService,
    private fb: FormBuilder,
    private firmSelectionService: FirmSelectionService,
    private customizeService: CustomizeService,
    private stockGeneralService:StockGeneralService
  ) {}

  ngOnInit(): void {
    this.initForm();

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
    });
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
      mainmenu_visibility: parentVisibilityMap
    };

    console.log('Final Payload being sent:', settingsPayload);

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
}
