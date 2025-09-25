import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CdkDragDrop, CdkDragEnd, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { debounceTime, distinctUntilChanged, merge } from 'rxjs';
import JsBarcode from 'jsbarcode';

import { NotificationService } from './../../../../Services/notification.service';
import { StockService } from '../../../../Services/Stock/stock.service';
import { TaggingService } from '../../../../Services/Tagging/tagging.service';
import { CustomizeService } from '../../../../Services/Customize_settings/customize.service';

@Component({
  selector: 'app-tag-labels',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DragDropModule],
  templateUrl: './tag-labels.component.html',
})
export class TagLabelsComponent implements OnInit, AfterViewInit {
  private readonly BARCODE_HEIGHT_TO_BAR_WIDTH_RATIO = 20;
  private readonly BARCODE_HEIGHT_TO_FONT_SIZE_RATIO = 4;

  // --- Component State ---
  private firmId: number = 1; // IMPORTANT: Replace with actual firm ID from your app's state/auth service.
  tags: any[] = [];
  taggingsList: any;
  filteredOptions: string[] = [];
  showDropdown = false;
  selectedOptionIndex: number = -1;
  private settingsLoaded = false;

  // --- Forms ---
  searchForm: FormGroup;
  barcodeSettingsForm: FormGroup;
  fieldSettingsForm: FormGroup;

  // --- Dynamic Styles & Positions ---
  barcodeContainerStyle: any = {};
  labelStyle: any = {};
  tagInfoStyle: any = {};
  tailStyle: any = {};
  fieldStyles: { [key: string]: any } = {};
  fieldPositions: { [key: string]: { x: number; y: number } } = {};

  // --- Field Management ---
  fieldVisibility: { [key: string]: boolean } = {
    itemName: true, barcode: true, itemCode: true, totalWeight: true,
    unitPrice: true, itemCategory: true, itemSize: true, itemColor: false,
    itemStoneType: true,
  };
  fieldKeys: string[] = Object.keys(this.fieldVisibility);
  customLabels: { [key: string]: string } = {};
  defaultFieldLabels: { [key: string]: string } = {
    itemName: 'Product', barcode: 'Barcode', itemCode: 'Code',
    totalWeight: 'Weight', unitPrice: 'Price', itemCategory: 'Category',
    itemSize: 'Size', itemColor: 'Colour', itemStoneType: 'Stone',
  };

  // --- NEW: Template Dimensions (Updated Sizes) ---
  templateDimensions: { [key: string]: { width: string, height: string } } = {
    default: { width: '400px', height: '70px' },
    square: { width: '200px', height: '200px' },
    rectangle: { width: '300px', height: '140px' }
  };

  @ViewChildren('barcodeCanvas') barcodeCanvases!: QueryList<ElementRef<SVGElement>>;

  constructor(
    private stockService: StockService,
    private taggingService: TaggingService,
    private notificationService: NotificationService,
    private customizeService: CustomizeService
  ) {
    this.searchForm = new FormGroup({ searchInput: new FormControl('') });

    this.barcodeSettingsForm = new FormGroup({
      topMargin: new FormControl(''), leftMargin: new FormControl(''),
      tailLength: new FormControl('120px'), // Default tail length
      tailSide: new FormControl('left'),
      templateType: new FormControl('default'),
      labelWidth: new FormControl('400px'), labelHeight: new FormControl('70px'),
      textAlign: new FormControl('left'), barcodeSize: new FormControl('20px'),
      deleteAll: new FormControl(false), generateBarcode: new FormControl(false),
    });

    const fieldControls: { [key: string]: FormControl } = {};
    Object.keys(this.defaultFieldLabels).forEach((field) => {
      fieldControls[field + 'Label'] = new FormControl('');
      fieldControls[field + 'Size'] = new FormControl('10');;
    });
    this.fieldSettingsForm = new FormGroup(fieldControls);
  }

  ngOnInit() {
    this.loadAllUserSettings();
    this.getTaggingList();
    this.setupFormAutosave();

    this.searchForm.get('searchInput')?.valueChanges.subscribe((value) => {
      const input = (value || '').toLowerCase();
      this.filteredOptions = this.taggingsList
        ?.map((x: any) => x.barcode)
        ?.filter((barcode: string) => barcode.toLowerCase().includes(input)) || [];
    });

    // Disable label width/height controls if templateType is not 'default'
    this.barcodeSettingsForm.get('templateType')?.valueChanges.subscribe(type => {
      if (type !== 'default') {
        this.barcodeSettingsForm.get('labelWidth')?.disable({ emitEvent: false });
        this.barcodeSettingsForm.get('labelHeight')?.disable({ emitEvent: false });
      } else {
        this.barcodeSettingsForm.get('labelWidth')?.enable({ emitEvent: false });
        this.barcodeSettingsForm.get('labelHeight')?.enable({ emitEvent: false });
      }
    });
  }

  ngAfterViewInit() {
    this.barcodeCanvases.changes.subscribe(() => {
        if (this.settingsLoaded) this.renderBarcodes();
    });
  }

  // --- START: DATA PERSISTENCE WITH DATABASE ---

  loadAllUserSettings() {
    this.customizeService.getUserSettings(this.firmId).subscribe({
      next: (res: any) => {
        if (res.success && res.data && Object.keys(res.data).length) {
          this.notificationService.showSuccess('Custom settings loaded.', 'Success');
          const settings = res.data;

          if (settings.barcode_settings) {
            this.barcodeSettingsForm.patchValue(settings.barcode_settings);
            // Manually trigger onTemplateTypeChange if templateType was loaded
            if (settings.barcode_settings.templateType) {
                this.onTemplateTypeChange(false); // Do not trigger save again
            }
          }
          if (settings.field_settings) {
            this.fieldSettingsForm.patchValue(settings.field_settings);
            if (settings.field_settings.visibility) this.fieldVisibility = settings.field_settings.visibility;
            this.updateCustomLabelsAndStyles(settings.field_settings);
          }
          if (settings.barcode_field_order?.length) this.fieldKeys = settings.barcode_field_order;
          if (settings.barcode_field_positions) {
            this.fieldPositions = settings.barcode_field_positions;
          } else {
            // Apply defaults only if templateType is "default"
            // if ((settings.barcode_settings?.templateType || 'default') === 'default') {
            //   this.fieldPositions = { ...this.defaultFieldPositions };
            // }
            this.fieldPositionsByTemplate = { ...this.initialTemplatePositions };
          }
        } else {
            this.initializeFieldSettings();
            this.onTemplateTypeChange(false); // Apply default template sizes if no settings
            this.fieldPositions = { ...this.defaultFieldPositions };
        }

        this.applySettings();
        this.settingsLoaded = true;
        setTimeout(() => this.renderBarcodes(), 0);
      },
      error: (err: any) => {
        this.notificationService.showError('Could not load settings.', 'Error');
        this.initializeFieldSettings();
        this.onTemplateTypeChange(false); // Apply default template sizes if error
        this.applySettings();
        this.settingsLoaded = true;
      }
    });
  }

  saveAllUserSettings() {
    if (!this.settingsLoaded) return;

    const settingsData = {
      customize_firm_id: this.firmId,
      barcode_settings: this.barcodeSettingsForm.value,
      field_settings: { ...this.fieldSettingsForm.value, visibility: this.fieldVisibility },
      barcode_field_order: this.fieldKeys,
      // barcode_field_positions: this.fieldPositions,
      barcode_field_positions: this.fieldPositionsByTemplate,
    };

    this.customizeService.saveUserSettings(settingsData).subscribe({
        next: () => this.notificationService.showSuccess('Settings saved!', 'Success'),
        error: () => this.notificationService.showError('Failed to save settings.', 'Error')
    });
  }

  setupFormAutosave(): void {
    merge(
        this.barcodeSettingsForm.valueChanges,
        this.fieldSettingsForm.valueChanges
    ).pipe(
        debounceTime(1500),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
    ).subscribe(() => {
        this.applyAndSave();
    });
  }

  // --- END: DATA PERSISTENCE WITH DATABASE ---

  onFieldDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.fieldKeys, event.previousIndex, event.currentIndex);
    this.saveAllUserSettings();
  }

  // onDragEnded(event: CdkDragEnd, fieldKey: string) {
  //   const newPosition = event.source.getFreeDragPosition();
  //   this.fieldPositions[fieldKey] = newPosition;
  //   this.saveAllUserSettings();
  // }

  onDragEnded(event: CdkDragEnd, fieldKey: string) {
  const newPosition = event.source.getFreeDragPosition();
  this.fieldPositionsByTemplate[this.currentTemplateType][fieldKey] = newPosition;
  this.saveAllUserSettings();
}


  updateFieldVisibility(key: string, value: string): void {
    this.fieldVisibility[key] = value.toLowerCase() === 'show';
    this.saveAllUserSettings();
  }

  applyAndSave() {
    this.applySettings();
    this.onSubmitFieldSettings();
    this.saveAllUserSettings();
  }

  initializeFieldSettings() {
    const initialSettings: { [key: string]: any } = {};
    Object.keys(this.defaultFieldLabels).forEach((field) => {
      initialSettings[field + 'Label'] = this.defaultFieldLabels[field];
      initialSettings[field + 'Size'] = '10';
    });
    this.fieldSettingsForm.patchValue(initialSettings);
    this.updateCustomLabelsAndStyles(initialSettings);
  }

  onSearch() {
    const barcode = this.searchForm.get('searchInput')?.value;
    if (barcode) this.getBarcodeData(barcode);
  }

  getBarcodeData(barcode: string) {
    this.stockService.getBarcodeDataWithBarcodeOrModelNo(barcode).subscribe((res: any) => {
      this.tags = (res.data || []).map((item: any) => ({
        itemName: item.std_item_name, barcode: item.std_barcode,
        itemCode: item.std_item_code, itemColor: item.std_color,
        itemCategory: item.std_item_category, itemSize: item.std_item_size,
        itemStoneType: item.std_stone_type, totalWeight: item.std_total_wt,
        unitPrice: item.std_unit_price,
      }));
      setTimeout(() => this.renderBarcodes(), 0);
    });
  }

  renderBarcodes() {
    if (!this.barcodeCanvases || this.barcodeCanvases.length === 0 || !this.settingsLoaded) return;
    const barcodeSizeValue = this.barcodeSettingsForm.get('barcodeSize')?.value;
    const targetHeight = this.parseSizeToPx(barcodeSizeValue);

    const targetBarWidth = targetHeight / this.BARCODE_HEIGHT_TO_BAR_WIDTH_RATIO;
    const targetFontSize = targetHeight / this.BARCODE_HEIGHT_TO_FONT_SIZE_RATIO;

    this.barcodeCanvases.forEach((canvasRef, index) => {
      const tag = this.tags[index];
      const svgElement = canvasRef.nativeElement;
      if (svgElement && tag?.barcode) {
        JsBarcode(svgElement, tag.barcode, {
          format: 'CODE128', lineColor: '#000', width: targetBarWidth,
          height: targetHeight, fontSize: targetFontSize, displayValue: true,
          textAlign: 'center', textMargin: 2, margin: 0,
        });
      }
    });
  }

  onSettingsSubmit() {
    this.applySettings();
    if (this.barcodeSettingsForm.get('deleteAll')?.value) {
      this.tags = [];
      this.fieldKeys = Object.keys(this.fieldVisibility);
      this.fieldPositions = {};
      this.saveAllUserSettings(); // Saves the reset state
      this.barcodeSettingsForm.patchValue({ deleteAll: false });
    }
    if (this.barcodeSettingsForm.get('generateBarcode')?.value) {
      this.renderBarcodes();
      this.barcodeSettingsForm.patchValue({ generateBarcode: false });
    }
  }

  // --- NEW: Handle Template Type Change ---
  onTemplateTypeChange(shouldSave: boolean = true) {
    const selectedTemplateType = this.barcodeSettingsForm.get('templateType')?.value;
    const dimensions = this.templateDimensions[selectedTemplateType];

    if (dimensions) {
      this.barcodeSettingsForm.patchValue({
        labelWidth: dimensions.width,
        labelHeight: dimensions.height
      }, { emitEvent: false }); // Avoid infinite loop with autosave
    }

    this.applySettings(); // Re-apply all settings including new dimensions
    if (shouldSave) {
        this.saveAllUserSettings(); // Save the new template type and dimensions
    }
  }

  applySettings() {
    const templateType = this.currentTemplateType;
    this.fieldPositions = this.fieldPositionsByTemplate[templateType] || {};

    const settings = this.barcodeSettingsForm.value;
    const selectedTemplateType = settings.templateType;

    let currentLabelWidth = settings.labelWidth;
    let currentLabelHeight = settings.labelHeight;

    // Override width/height if a specific template type is selected (not 'default')
    if (selectedTemplateType && selectedTemplateType !== 'default') {
        const templateDim = this.templateDimensions[selectedTemplateType];
        if (templateDim) {
            currentLabelWidth = templateDim.width;
            currentLabelHeight = templateDim.height;
        }
    }

    this.barcodeContainerStyle = { 'margin-top': this.formatDimension(settings.topMargin), 'margin-left': this.formatDimension(settings.leftMargin) };
    this.labelStyle = { width: this.formatDimension(currentLabelWidth), height: this.formatDimension(currentLabelHeight), 'flex-shrink': 0 };

    // --- NEW: Tail display logic ---
    const tailLength = settings.tailLength;
    if (tailLength === 'none') {
        this.tailStyle = { display: 'none' };
        this.tagInfoStyle = { 'text-align': settings.textAlign || 'left', width: '100%' }; // Adjust tagInfo width if no tail
    } else {
        this.tailStyle = { width: this.formatDimension(tailLength), height: '10px', backgroundColor: '#a0a0a0', 'flex-shrink': 0, display: 'block' };
        this.tagInfoStyle = { 'text-align': settings.textAlign || 'left' }; // Restore original tagInfo style
    }
    // --- END: NEW Tail display logic ---

    this.renderBarcodes();
  }

  onSubmitFieldSettings(): void {
    const settings = this.fieldSettingsForm.value;
    this.updateCustomLabelsAndStyles(settings);
  }

  updateCustomLabelsAndStyles(settings: any) {
    Object.keys(this.defaultFieldLabels).forEach((field) => {
      this.customLabels[field] = settings[field + 'Label'];
      const size = settings[field + 'Size'];
      this.fieldStyles[field] = { 'font-size': this.formatDimension(size, 'px') || 'inherit' };
    });
  }

  formatValue(tag: any, fieldKey: string): string {
    if (!tag || !fieldKey || !tag.hasOwnProperty(fieldKey)) return '';
    const value = tag[fieldKey];
    switch (fieldKey) {
      case 'totalWeight': return `${value} g`;
      case 'unitPrice': return `₹${value}`;
      default: return value;
    }
  }

  private formatDimension(value: string | null, defaultUnit: string = 'mm'): string | null {
    if (!value || value.trim() === '') return null;
    const trimmedValue = value.trim().toLowerCase();
    if (trimmedValue === 'none') return null; // Handle 'none' for tail length
    if (['px', 'mm', 'pt', 'rem', 'em', '%'].some((unit) => trimmedValue.endsWith(unit))) return trimmedValue;
    if (!isNaN(parseFloat(trimmedValue)) && isFinite(Number(trimmedValue))) return `${trimmedValue}${defaultUnit}`;
    return null;
  }

  private parseSizeToPx(value: any): number {
    const defaultValue = 40;
    if (!value) return defaultValue;
    const MM_TO_PX_RATE = 96 / 25.4;
    const strValue = String(value).trim().toLowerCase();
    let numericValue: number;
    if (strValue.endsWith('mm')) {
      numericValue = parseFloat(strValue.replace('mm', '').trim());
      return !isNaN(numericValue) ? numericValue * MM_TO_PX_RATE : defaultValue;
    }
    if (strValue.endsWith('px')) {
      numericValue = parseFloat(strValue.replace('px', '').trim());
      return !isNaN(numericValue) ? numericValue : defaultValue;
    }
    numericValue = parseFloat(strValue);
    return !isNaN(numericValue) ? numericValue : defaultValue;
  }

  getLabel(key: string): string {
    return this.customLabels[key] || this.defaultFieldLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  }

  getTaggingList() {
    this.taggingService.getStockDetailsByProductType().subscribe({
      next: (response: any) => {
        if (response?.data?.length) {
          this.taggingsList = response.data.map((item: any) => ({ barcode: item.std_barcode }));
        }
      },
      error: (error: any) => {},
    });
  }

  onSelectOption(option: string) {
    this.searchForm.patchValue({ searchInput: option });
    this.filteredOptions = [];
    this.showDropdown = false;
    this.onSearch();
  }

  onBlurDropdown() {
    setTimeout(() => { this.showDropdown = false; }, 150);
  }

  onKeydown(event: KeyboardEvent) {
    if (!this.filteredOptions.length) return;
    switch (event.key) {
      case 'ArrowDown':
        this.selectedOptionIndex = (this.selectedOptionIndex + 1) % this.filteredOptions.length;
        event.preventDefault(); break;
      case 'ArrowUp':
        this.selectedOptionIndex = (this.selectedOptionIndex - 1 + this.filteredOptions.length) % this.filteredOptions.length;
        event.preventDefault(); break;
      case 'Enter':
        if (this.selectedOptionIndex >= 0 && this.selectedOptionIndex < this.filteredOptions.length) {
          this.onSelectOption(this.filteredOptions[this.selectedOptionIndex]);
          event.preventDefault();
        } break;
      case 'Escape': this.showDropdown = false; break;
    }
  }

  handleFocus() {
    this.showDropdown = true;
    const inputValue = this.searchForm.get('searchInput')?.value?.toLowerCase() || '';
    this.filteredOptions = this.taggingsList
        ?.map((x: any) => x.barcode)
        ?.filter((barcode: string) => barcode.toLowerCase().includes(inputValue)) || [];
  }

  directPrint() {
    const printContents = document.querySelector(
      '.flex.flex-wrap.justify-center.gap-6.mt-8'
    )?.innerHTML;
    const printWindow = window.open('', '_blank', 'height=600,width=800');

    if (printWindow && printContents) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Print-Preview</title>
          <style>
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            @media print {
              .no-print {
                display: none !important;
              }
              body { margin: 0; padding: 0; }
              .flex { display: flex; }
              .flex-wrap { flex-wrap: wrap; }
              .justify-center { justify-content: center; }
              .gap-6 { gap: 1.5rem; }
              .mt-8 { margin-top: 2rem; }
              .items-center { align-items: center; }
              .w-full { width: 100%; }
              .sm\\:w-\\[45\\%\\] { width: 45%; }
              .max-w-md { max-width: 28rem; }
              .bg-white { background-color: #fff; }
              .rounded-2xl { border-radius: 1rem; }
              .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
              .border { border-width: 1px; }
              .border-gray-200 { border-color: #e5e7eb; }
              .relative { position: relative; }
              .p-2 { padding: 0.5rem; }
              .absolute { position: absolute; }
              .cursor-move { cursor: move; }
              .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
              .text-gray-700 { color: #374151; }
              .break-words { overflow-wrap: break-word; }
              .font-medium { font-weight: 500; }
              .mr-2 { margin-right: 0.5rem; }
            }
          </style>
        </head>
        <body onload="window.print();window.close()">
          ${printContents}
        </body>
      </html>
    `);
      printWindow.document.close();
    }
  }

  public removeLabel(indexToRemove: number): void {
    this.tags.splice(indexToRemove, 1);
  }

  private defaultFieldPositions: { [key: string]: { x: number, y: number } } = {
    barcode: { x: 251, y: 0 },
    itemCode: { x: 11, y: 1 },
    itemName: { x: 12, y: 35 },
    itemSize: { x: 11, y: 18 },
    itemColor: { x: 154, y: 83 },
    unitPrice: { x: 259, y: 33 },
    totalWeight: { x: 132, y: 15 },
    itemCategory: { x: 129, y: -1 },
    itemStoneType: { x: 131, y: 36 },
  };

  private initialTemplatePositions: {
    [key: string]: { [key: string]: { x: number, y: number } }
  } = {
    square: {
      barcode: { x: 27, y: 12 },
      itemCode: { x: 4, y: 123 },
      itemName: { x: 6, y: 101 },
      itemSize: { x: 105, y: 100 },
      itemColor: { x: 154, y: 83 },
      unitPrice: { x: 6, y: 56 },
      totalWeight: { x: 108, y: 76 },
      itemCategory: { x: 97, y: 54 },
      itemStoneType: { x: 5, y: 78 },
    },
    default: {
      barcode: { x: 251, y: 0 },
      itemCode: { x: 11, y: 1 },
      itemName: { x: 12, y: 35 },
      itemSize: { x: 11, y: 18 },
      itemColor: { x: 154, y: 83 },
      unitPrice: { x: 259, y: 33 },
      totalWeight: { x: 132, y: 15 },
      itemCategory: { x: 129, y: -1 },
      itemStoneType: { x: 131, y: 36 },
    },
    rectangle: {
      barcode: { x: 76, y: 17 },
      itemCode: { x: 9, y: 108 },
      itemName: { x: 10, y: 89 },
      itemSize: { x: 11, y: 71 },
      itemColor: { x: 154, y: 83 },
      unitPrice: { x: 209, y: 104 },
      totalWeight: { x: 208, y: 76 },
      itemCategory: { x: 103, y: 78 },
      itemStoneType: { x: 109, y: 106 },
    }
  };

  private fieldPositionsByTemplate: {
    [key: string]: { [key: string]: { x: number, y: number } }
  } = { ...this.initialTemplatePositions };

  get currentTemplateType(): string {
    return this.barcodeSettingsForm.get('templateType')?.value || 'default';
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
      ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);
      const index = focusable.indexOf(target);
      if (index > -1 && index + 1 < focusable.length) {
        focusable[index + 1].focus();
      }
    }
  }
}
