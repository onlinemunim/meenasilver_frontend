import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../Services/notification.service';
import { StockGeneralService } from '../Services/Product_Creation/stock-general.service';
import { FirmSelectionService } from '../Services/firm-selection.service';
import { CustomizeService } from '../Services/Customize_settings/customize.service';

@Component({
  selector: 'app-customize-form',
  templateUrl: './customize-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class CustomizeFormComponent implements OnInit {
  // --- FIELD DEFINITIONS ---
  // Fields with 'required: true' will always be checked, disabled, and saved.
  // This ensures core form functionality is never broken by accident.
  fields = [
    { key: 'model_number', label: 'Model No', required: true },
    { key: 'unique_code_sku', label: 'Unique Code SKU', required: true },
    { key: 'type', label: 'Type', required: true },
    { key: 'brand_name', label: 'Brand Name', required: false },
    { key: 'group', label: 'Group', required: true },
    { key: 'category_id', label: 'Category', required: true },
    { key: 'sub_category_id', label: 'Sub Category', required: false },
    { key: 'product_name', label: 'Product Name', required: true },
    { key: 'hsn_code', label: 'HSN Code', required: false },
    { key: 'metal_type', label: 'Metal Type', required: true },
    { key: 'purity', label: 'Purity', required: true },
    { key: 'unit', label: 'Unit', required: false },
    { key: 'subunit', label: 'Subunit', required: false },
    { key: 'conversion', label: 'Conversion', required: false },
    { key: 'size', label: 'Size', required: false },
    { key: 'gender', label: 'Gender', required: false },
    { key: 'description', label: 'Description', required: false },
    // { key: 'labour_charges', label: 'Labour Charges', required: false },
    { key: 'making_charges', label: 'Making Charges', required: false },
    { key: 'making_charges_unit', label: 'Making Charges Unit', required: false },
    { key: 'thread_weight', label: 'Thread Weight', required: false },
    { key: 'total_thread_price', label: 'Total Thread Price', required: false },
    { key: 'actual_weight', label: 'Actual Weight', required: false },
    { key: 'min_weight', label: 'Minimum Weight', required: false },
    { key: 'max_weight', label: 'Maximum Weight', required: false },
    { key: 'min_size', label: 'Minimum Size', required: false },
    { key: 'max_size', label: 'Maximum Size', required: false },
    { key: 'sell_dis_code', label: 'Sell Discount Code', required: false },
    { key: 'min_disc', label: 'Minimum Discount', required: false },
    { key: 'max_disc', label: 'Maximum Discount', required: false },
    { key: 'disc_type', label: 'Discount Type', required: false },
    { key: 'color', label: 'Color', required: false },
    { key: 'clarity', label: 'Clarity', required: false },
    { key: 'height', label: 'Height', required: false },
    { key: 'length', label: 'Length', required: false },
    { key: 'width', label: 'Width', required: false },
    { key: 'stamp', label: 'Stamp', required: false },
    { key: 'supplier_code', label: 'Supplier Code', required: false },
    { key: 'submit', label: 'Submit Button', required: false },
  ];

  // ALL price fields are 'required: false', so they can all be unchecked.
  // If you want any of these to be mandatory, change 'required' to 'true'.
  priceFields = [
    { key: 'sub_unit_price', label: 'Sub Unit Price', required: true },
    { key: 'main_unit_price', label: 'Main Unit Price', required: true },
    { key: 'purchase_price', label: 'Purchase Price', required: true },
    { key: 'labour_charges', label: 'Labour Charges', required: true },
    { key: 'sell_price', label: 'Sell Price', required: false },
    { key: 'mrp', label: 'MRP', required: false },
    { key: 'gst', label: 'GST (%)', required: false },
    { key: 'tax_in_price', label: 'Tax in Price', required: false },
    { key: 'purchase_price_with_gst', label: 'Purchase Price with GST', required: false },
    { key: 'sell_price_with_gst', label: 'Sell Price with GST', required: false },
    { key: 'mrp_with_gst', label: 'MRP with GST', required: false },
    { key: 'wholesale_sell_price', label: 'Wholesale Sell Price', required: false },
    { key: 'wholesale_sell_quantity', label: 'Wholesale Sell Quantity', required: false },
    { key: 'wholesale_sell_purchase_price', label: 'Wholesale Purchase Price', required: false },
    { key: 'wholesale_sell_purchase_quantity', label: 'Wholesale Purchase Quantity', required: false },
    { key: 'wholesale_sell_price_with_gst', label: 'Wholesale Sell Price with GST', required: false },
    { key: 'wholesale_purchase_price_with_gst', label: 'Wholesale Purchase Price with GST', required: false },
    { key: 'low_stock_unit', label: 'Low Stock Unit', required: false },
    { key: 'l_unit_type', label: 'Low Unit Type', required: false },
    { key: 'min_wastage', label: 'Minimum Wastage', required: false },
    { key: 'max_wastage', label: 'Maximum Wastage', required: false },
    { key: 'w_type', label: 'Wastage Type', required: false },
    { key: 'min_making', label: 'Minimum Making Charges', required: false },
    { key: 'max_making', label: 'Maximum Making Charges', required: false },
    { key: 'm_type', label: 'Making Charges Type', required: false },
    { key: 'wholesale_min_stock', label: 'Wholesale Minimum Stock', required: false },
    { key: 'type', label: 'Type', required: false }, // Note: 'type' key exists in both general and price. Ensure names are unique in the form.
    { key: 'purchase_account', label: 'Purchase Account', required: false },
    { key: 'sell_account', label: 'Sell Account', required: false },
  ];

  // These objects are bound to the [(ngModel)] of the checkboxes
  tempSelectedFields: { [key: string]: boolean } = {};
  tempSelectedPriceFields: { [key: string]: boolean } = {};

  // Other form properties
  newMetalPrefix: string = '';
  newStonePrefix: string = '';
  selectedFirmId: number | null = null;

  constructor(
    public notificationService: NotificationService,
    private router: Router,
    private stockGeneralService: StockGeneralService,
    private firmSelectionService: FirmSelectionService,
    private customizeService: CustomizeService
  ) { }

  ngOnInit(): void {
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      this.selectedFirmId = firm?.id;
      // When firm changes, reset checkboxes and load new settings
      this.initializeFieldStates();
      if (this.selectedFirmId) {
        this.loadUserSettings();
      }
    });
  }

  /**
   * Initializes the checkbox states to their default (required fields checked).
   */
  initializeFieldStates(): void {
    this.fields.forEach(field => {
      this.tempSelectedFields[field.key] = field.required;
    });
    this.priceFields.forEach(field => {
      this.tempSelectedPriceFields[field.key] = field.required;
    });
  }

  /**
   * Loads user settings from the DB and updates the checkboxes on this page.
   * After loading, it broadcasts the settings to the rest of the application.
   */
  loadUserSettings(): void {
    if (!this.selectedFirmId) return;

    this.customizeService.getUserSettings(this.selectedFirmId).subscribe({
      next: (response) => {
        const settings = response.data;

        let generalFieldsToBroadcast: string[] = [];
        let priceFieldsToBroadcast: string[] = [];

        // If NO settings exist in DB for this firm, default to showing everything.
        if (!settings || Object.keys(settings).length === 0) {
          this.fields.forEach(f => this.tempSelectedFields[f.key] = true);
          this.priceFields.forEach(f => this.tempSelectedPriceFields[f.key] = true);
        } else {
          // Settings EXIST in DB, so use them.
          // Check if 'form_general_fields' array exists in the settings object.
          // If it exists (even if it's empty), use it. If not, default to all visible.
          const generalFieldsFromDb = settings.form_general_fields;
          if (Array.isArray(generalFieldsFromDb)) {
            const visibleFields = new Set(generalFieldsFromDb);
            this.fields.forEach(field => {
              this.tempSelectedFields[field.key] = visibleFields.has(field.key) || field.required;
            });
          } else { // Fallback if the key is missing
            this.fields.forEach(f => this.tempSelectedFields[f.key] = true);
          }

          const priceFieldsFromDb = settings.form_price_fields;
          if (Array.isArray(priceFieldsFromDb)) {
            const visiblePriceFields = new Set(priceFieldsFromDb);
            this.priceFields.forEach(field => {
              this.tempSelectedPriceFields[field.key] = visiblePriceFields.has(field.key) || field.required;
            });
          } else { // Fallback if the key is missing
            this.priceFields.forEach(f => this.tempSelectedPriceFields[f.key] = true);
          }

          // Load Prefixes
          this.newMetalPrefix = settings.customize_metal_prefix || '';
          this.newStonePrefix = settings.customize_stone_prefix || '';
        }

        // Get the final state of visible fields to broadcast
        generalFieldsToBroadcast = Object.keys(this.tempSelectedFields).filter(key => this.tempSelectedFields[key]);
        priceFieldsToBroadcast = Object.keys(this.tempSelectedPriceFields).filter(key => this.tempSelectedPriceFields[key]);

        // Broadcast the final loaded state to the rest of the app.
        this.customizeService.updateFieldVisibility(generalFieldsToBroadcast, priceFieldsToBroadcast);
      },
      error: (err) => {
        // If settings fail to load, default to showing everything and notify user.
        this.fields.forEach(f => this.tempSelectedFields[f.key] = true);
        this.priceFields.forEach(f => this.tempSelectedPriceFields[f.key] = true);
        const allGeneral = this.fields.map(f => f.key);
        const allPrice = this.priceFields.map(f => f.key);
        this.customizeService.updateFieldVisibility(allGeneral, allPrice);
        this.notificationService.showError('Could not load custom settings. Displaying all fields.', 'Error');
      }
    });
  }


  /**
   * Saves all settings to the database and broadcasts the changes to the app.
   */
  saveAllSettings(): void {
    if (!this.selectedFirmId) {
      this.notificationService.showError('Firm not selected. Cannot save settings.', 'Error');
      return;
    }

    // Create an array of keys for ONLY the checked General fields.
    const visibleGeneralFields = Object.keys(this.tempSelectedFields)
      .filter(key => this.tempSelectedFields[key] === true);

    // Create an array of keys for ONLY the checked Price fields.
    const visiblePriceFields = Object.keys(this.tempSelectedPriceFields)
      .filter(key => this.tempSelectedPriceFields[key] === true);

    // Build the complete payload for the API
    const settingsPayload = {
      customize_firm_id: this.selectedFirmId,
      form_general_fields: visibleGeneralFields,
      form_price_fields: visiblePriceFields,
      // customize_metal_prefix: this.newMetalPrefix?.trim(),
      // customize_stone_prefix: this.newStonePrefix?.trim(),
    };

    // Call the service to save all settings
    this.customizeService.saveUserSettings(settingsPayload).subscribe({
      next: () => {
        // After a successful save, broadcast the NEW settings to the rest of the app.
        this.customizeService.updateFieldVisibility(visibleGeneralFields, visiblePriceFields);
        this.notificationService.showSuccess('Customization settings saved successfully.', 'Success');
      },
      error: (err) => {
        this.notificationService.showError('Failed to save settings.', 'Error');
      }
    });
  }

  // --- UI Helper Methods for Checkboxes ---
  selectAll() { this.fields.forEach(f => { this.tempSelectedFields[f.key] = true; }); }

  /** Unselects all fields that are NOT required. Required fields remain checked. */
  unselectAll() { this.fields.forEach(f => { if (!f.required) this.tempSelectedFields[f.key] = false; }); }

  selectAllPriceFields() { this.priceFields.forEach(f => { this.tempSelectedPriceFields[f.key] = true; }); }

  /** Unselects all fields that are NOT required. Required fields remain checked. */
  unselectAllPriceFields() { this.priceFields.forEach(f => { if (!f.required) this.tempSelectedPriceFields[f.key] = false; }); }

  goBack() { this.router.navigate(['/product-creation']); }
}
