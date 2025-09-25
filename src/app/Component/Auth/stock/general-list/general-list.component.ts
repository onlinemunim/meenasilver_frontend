import { NgFor, NgIf, CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { PackagingService } from '../../../../Services/Product_Creation/packaging.service';
import { MetalService } from '../../../../Services/metal.service';
import { ProductService } from '../../../../Services/product.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-general-list',
  standalone: true,
  imports: [NgFor, RouterLink, FormsModule, NgIf, CommonModule],
  templateUrl: './general-list.component.html',
  styleUrls: ['./general-list.component.css'],
})
export class GeneralListComponent implements OnInit {
  stockGeneralList: any[] = [];
  paginatedStockList: any[] = [];
  generalData: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  fieldOptions: any;
  showDropdown: boolean = false;
  showselectDropdown: boolean = false;
  columns: any;
  visibleRowCount: any;
  globalSearchText: any;
  defaultFields: any[] = [];
  packagingDetail: any;
  metalDataList: any;
  stoneDataList:any;
  currentFirmId:any;
  firmSelectionSubscription:any;

  constructor(
    private stockGeneralService: StockGeneralService,
    private snackBar: MatSnackBar,
    private eRef: ElementRef,
    private packagingService:PackagingService,
    private MetalService:MetalService,
    private firmSelectionService: FirmSelectionService,
    private productservice:ProductService
  ) {}

  router = inject(Router);

  ngOnInit(): void {
    this.firmSelectionSubscription = this.firmSelectionService.selectedFirmName$
      .subscribe((firm: any) => {
        this.currentFirmId = firm?.id;

        const genralist = localStorage.getItem('generallist');
          if (genralist) {
            this.fields = JSON.parse(genralist);
          }
          this.getStockGeneralList();
          this.getAllGeneral();
      });
  }

  // for list
  listTypes: string[] = ['General', 'categories', 'List 3'];
  selectedListType: string = '';
  searchField: string | null = null;
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  searchValues: { [key: string]: string } = {
    barcode: '',
    unique_code_sku: '',
    brand_name: '',
    group: '',
    product_name: '',
    hsn_code: '',
  };

  updateVisibleRows() {
    this.paginatedStockList = this.stockGeneralList.slice(
      0,
      this.visibleRowCount
    );
  }

  filterTable() {
    const isEmptyColumnSearch = Object.values(this.searchValues).every(
      (v) => v === ''
    );
    const isEmptyGlobalSearch = !this.globalSearchText?.trim();
    if (isEmptyColumnSearch && isEmptyGlobalSearch) {
      this.paginatedStockList = [...this.stockGeneralList];
      return;
    }

    this.paginatedStockList = this.stockGeneralList.filter((item) => {
      const matchesGlobalSearch = isEmptyGlobalSearch
        ? true
        : Object.values(item).some((val) =>
            String(val)
              .toLowerCase()
              .includes(this.globalSearchText.toLowerCase())
          );
      const matchesColumnSearch = Object.entries(this.searchValues).every(
        ([key, value]) =>
          value === '' ||
          item[key]?.toString().toLowerCase().includes(value.toLowerCase())
      );
      return matchesGlobalSearch && matchesColumnSearch;
    });
    if (this.paginatedStockList.length === 0) {
      const snackRef = this.snackBar.open('No products found.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      snackRef.onAction().subscribe(() => {
        this.globalSearchText = '';
        this.searchValues = {
          barcode: '',
          unique_code_sku: '',
          brand_name: '',
          group: '',
          product_name: '',
          hsn_code: '',
        };
        this.paginatedStockList = [...this.stockGeneralList];
      });
    }
  }

  onHeaderClick(field: string): void {
    this.searchField = this.searchField === field ? null : field;
    console.log(this.searchField);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.eRef.nativeElement.contains(target)) {
      this.showDropdown = false;
    }
  }

  showRelatedList() {
    if (this.selectedListType === 'General') {
      this.router.navigate(['general-list']);
    } else if (this.selectedListType === 'categories') {
      this.router.navigate(['categories-list']);
    }
  }

  getStockGeneralList() {
    let params = new HttpParams().set('firm_id', this.currentFirmId);
    this.stockGeneralService.getProducts(params).subscribe((response: any) => {
      this.stockGeneralList = [...response.data].reverse();
      this.totalPages = Math.ceil(
        this.stockGeneralList.length / this.itemsPerPage
      );
      this.updatePaginatedList();
    });
  }


  deleteGeneralProduct(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This product will be permanently deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#c19725',
      cancelButtonColor: '#c19725',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.stockGeneralService.deleteProduct(id).subscribe({
          next: (response: any) => {
            Swal.fire('Deleted!', 'The product has been deleted.', 'success');
            // Optionally refresh list
            this.getStockGeneralList();
          },
          error: () => {
            Swal.fire(
              'Error!',
              'Something went wrong while deleting.',
              'error'
            );
          },
        });
      }
    });
  }

  updatePaginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedStockList = this.stockGeneralList.slice(start, end);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedList();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedList();
    }
  }


  get pageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }


  downloadCSV(): void {
    const selectedFields = this.fields.filter((field) => field.selected);

    const headers = ['No.', ...selectedFields.map((field) => field.label)];
    const rows: (string | number)[][] = this.stockGeneralList.map((item: any, index: number) => {
      const row: (string | number)[] = [index + 1];
      selectedFields.forEach((field) => {
        row.push(this.resolveValue(item, field.key));
      });
      return row;
    });

    let csvContent = '';
    csvContent += headers.join(',') + '\r\n';
    rows.forEach((row) => {
      const escapedRow = row.map(
        (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`
      );
      csvContent += escapedRow.join(',') + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'product-list.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


  downloadPDF(): void {
    const doc = new jsPDF('l', 'mm', 'a4'); // landscape A4

    const selectedFields = this.fields.filter((field) => field.selected);

    const headers = [
      { header: 'No.', dataKey: 'no' },
      ...selectedFields.map((field) => ({
        header: field.label,
        dataKey: field.key,
      })),
    ];

    const data = this.stockGeneralList.map((item, index) => {
      const row: any = { no: index + 1 };
      selectedFields.forEach((field) => {
        row[field.key] = this.resolveValue(item, field.key);
      });
      return row;
    });

    autoTable(doc, {
      columns: headers,
      body: data,
      styles: {
        fontSize: 6, // Smaller font to fit more data
        cellPadding: 1.5,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [0, 123, 255],
        textColor: 255,
        halign: 'center',
        fontSize: 7,
      },
      bodyStyles: {
        valign: 'top',
      },
      startY: 10,
      margin: { top: 10, left: 5, right: 5 },
      theme: 'grid',
      tableWidth: 'wrap', // Wrap the table to fit content
      horizontalPageBreak: true, // Enable horizontal splitting
      pageBreak: 'auto',
      didDrawPage: (data) => {
        // Optional: Add page numbers or custom header/footer here
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height;
        doc.setFontSize(8);
        doc.text(
          `Page ${(doc as any).internal.getNumberOfPages()}`,
          pageSize.width - 20,
          pageHeight - 10
        );
      },
    });

    doc.save('product-list.pdf');
  }

  downloadExcel(): void {
    const selectedFields = this.fields.filter((field) => field.selected);

    const data = this.stockGeneralList.map((item, index) => {
      const row: any = { 'No.': index + 1 };
      selectedFields.forEach((field) => {
        row[field.label] = this.resolveValue(item, field.key);
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'product-list.xlsx');
  }

  downloadJSONRow(item: any) {
    const jsonString = JSON.stringify(item, null, 2); // Pretty-print JSON

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `product-${item.id || 'data'}.json`;
    a.click();

    window.URL.revokeObjectURL(url);
  }


  downloadJSONAll(): void {
    const selectedFields = this.fields
      .filter((f) => f.selected)
      .map((f) => f.key);

    const filteredData = this.paginatedStockList.map((item) => {
      const filteredItem: any = {};
      selectedFields.forEach((field) => {
        filteredItem[field] = this.resolveValue(item, field);
      });
      return filteredItem;
    });

    const jsonString = JSON.stringify(filteredData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'general-list.json';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  fields = [
    { key: 'model_number', label: 'Model Number', selected: true },
    { key: 'unique_code_sku', label: 'Product SKU', selected: true },
    { key: 'type', label: 'Type', selected: true },
    { key: 'category.name', label: 'Category', selected: true },
    { key: 'sub_category_id', label: 'Sub Category', selected: true },
    { key: 'brand_name', label: 'Brand Name', selected: true },
    { key: 'supplier_code', label: 'Supplier Code', selected: true },
    { key: 'group', label: 'Group', selected: true },
    { key: 'product_name', label: 'Product Name', selected: true },
    { key: 'hsn_code', label: 'HSN Code', selected: true },
    { key: 'metal_type', label: 'Metal Type', selected: true },
    { key: 'purity', label: 'Purity', selected: true },
    { key: 'stamp', label: 'Stamp', selected: false },
    { key: 'unit', label: 'Unit', selected: false },
    { key: 'subunit', label: 'Subunit', selected: false },
    { key: 'conversion', label: 'Conversion', selected: false },
    { key: 'size', label: 'Size', selected: false },
    { key: 'gender', label: 'Gender', selected: false },
    { key: 'labour_charges', label: 'Labour Charges', selected: false },
    { key: 'making_charges', label: 'Making Charges', selected: false },
    { key: 'making_charges_unit', label: 'Making Charges Unit', selected: false },
    { key: 'thread_weight', label: 'Thread Weight', selected: false },
    { key: 'total_thread_price', label: 'Total Thread Price', selected: false },
    { key: 'actual_weight', label: 'Actual Weight', selected: false },
    { key: 'min_weight', label: 'Min Weight', selected: false },
    { key: 'max_weight', label: 'Max Weight', selected: false },
    { key: 'min_size', label: 'Min Size', selected: false },
    { key: 'max_size', label: 'Max Size', selected: false },
    { key: 'sell_dis_code', label: 'Sell Discount Code', selected: false },
    { key: 'min_disc', label: 'Min Discount', selected: false },
    { key: 'max_disc', label: 'Max Discount', selected: false },
    { key: 'disc_type', label: 'Discount Type', selected: false },
    { key: 'color', label: 'Color', selected: false },
    { key: 'clarity', label: 'Clarity', selected: false },
    { key: 'height', label: 'Height', selected: false },
    { key: 'length', label: 'Length', selected: false },
    { key: 'width', label: 'Width', selected: false },
    { key: 'description', label: 'Description', selected: false },
  ];

  applyColumnSelection() {
    localStorage.setItem( 'generallist', JSON.stringify(this.fields));
    this.showDropdown = false;
  }


  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  selectDropdown() {
    this.showselectDropdown = !this.showselectDropdown;
  }


  selectAllFields() {
    this.fields.forEach((field) => (field.selected = true));
  }


  deselectAllFields() {
    this.fields.forEach((field) => (field.selected = false));
  }

  get selectedFields() {
    return this.fields.filter((field) => field.selected);
  }


  restoreColumnSelection(): void {
    localStorage.removeItem('generallist');
    this.fields= [

    { key: 'model_number', label: 'Model Number', selected: true },
    { key: 'unique_code_sku', label: 'Product SKU', selected: true },
    { key: 'type', label: 'Type', selected: true },
    { key: 'category.name', label: 'Category', selected: true },
    { key: 'sub_category_id', label: 'Sub Category', selected: true },
    { key: 'brand_name', label: 'Brand Name', selected: true },
    { key: 'supplier_code', label: 'Supplier Code', selected: true },
    { key: 'group', label: 'Group', selected: true },
    { key: 'product_name', label: 'Product Name', selected: true },
    { key: 'hsn_code', label: 'HSN Code', selected: true },
    { key: 'metal_type', label: 'Metal Type', selected: true },
    { key: 'purity', label: 'Purity', selected: true },
    { key: 'stamp', label: 'Stamp', selected: false },
    { key: 'unit', label: 'Unit', selected: false },
    { key: 'subunit', label: 'Subunit', selected: false },
    { key: 'conversion', label: 'Conversion', selected: false },
    { key: 'size', label: 'Size', selected: false },
    { key: 'gender', label: 'Gender', selected: false },
    { key: 'labour_charges', label: 'Labour Charges', selected: false },
    { key: 'making_charges', label: 'Making Charges', selected: false },
    { key: 'making_charges_unit', label: 'Making Charges Unit', selected: false },
    { key: 'thread_weight', label: 'Thread Weight', selected: false },
    { key: 'total_thread_price', label: 'Total Thread Price', selected: false },
    { key: 'actual_weight', label: 'Actual Weight', selected: false },
    { key: 'min_weight', label: 'Min Weight', selected: false },
    { key: 'max_weight', label: 'Max Weight', selected: false },
    { key: 'min_size', label: 'Min Size', selected: false },
    { key: 'max_size', label: 'Max Size', selected: false },
    { key: 'sell_dis_code', label: 'Sell Discount Code', selected: false },
    { key: 'min_disc', label: 'Min Discount', selected: false },
    { key: 'max_disc', label: 'Max Discount', selected: false },
    { key: 'disc_type', label: 'Discount Type', selected: false },
    { key: 'color', label: 'Color', selected: false },
    { key: 'clarity', label: 'Clarity', selected: false },
    { key: 'height', label: 'Height', selected: false },
    { key: 'length', label: 'Length', selected: false },
    { key: 'width', label: 'Width', selected: false },
    { key: 'description', label: 'Description', selected: false },
  ];
}


  getAllGeneral() {
    let params = new HttpParams().set('firm_id', this.currentFirmId);
    this.stockGeneralService.getProducts(params).subscribe((response: any) => {
      this.generalData = response.data;
    });
  }


  printTable() {
    const originalData = this.paginatedStockList;
    this.paginatedStockList = this.stockGeneralList;

    setTimeout(() => {
      window.print();
      this.paginatedStockList = originalData;
    }, 0);
  }



  sortBy(field: string) {
    if (this.sortKey === field) {

      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = field;
      this.sortDirection = 'asc';
    }

    this.stockGeneralList.sort((a, b) => {
      // CHANGE THESE TWO LINES:
      const aVal = this.resolveValue(a, field);
      const bVal = this.resolveValue(b, field);

      if (aVal == null) return 1;
      if (bVal == null) return -1;

      const aStr = String(aVal).toLowerCase();
      const bStr = String(bVal).toLowerCase();

      if (aStr < bStr) return this.sortDirection === 'asc' ? -1 : 1;
      if (aStr > bStr) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePaginatedList();
  }

  openProductDetails(id: number): void {
    //for packaging
    this.packagingService.getPackagingListByProductId(id).subscribe((packagingResponse: any) => {
      const packagingList = packagingResponse?.data?.filter((p: any) => p.product_id === id) || [];

      //for metal
      this.MetalService.getMetalsByProductId(id).subscribe((metalResponse: any) => {
        const metalDataList = metalResponse?.data?.filter((m: any) => m.product_id === id) || [];

        //for stone
        this.productservice.getStonesByProductId(id).subscribe((stoneResponse: any) => {
          const stoneDataList = stoneResponse?.data?.filter((s: any) => s.product_id === id) || [];

          //for general details
          this.stockGeneralService.getProductById(id).subscribe((response: any) => {
            const product = response?.data || null;
            const allFields = this.fields;

            const generalHtml = product
              ? allFields.map(field => {
                  const value = this.resolveValue(product, field.key);
                  return `<p><strong style="color: #c19725;">${field.label}:</strong> ${value}</p>`;
                }).join('')
              : `<p>No data found</p>`;

            const packagingHtml = packagingList.length > 0
              ? packagingList.map((p: { product_code: any; material_name: any; material_categories: any; size: any; quantity: any; per_piece: any; total_price: any; supplier_code: any; }, i: number) => `
                <div style="margin-bottom: 10px; border: 1px solid #ccc; padding: 10px; border-radius: 6px;">
                  <h4 style="color: #c19725; margin-bottom: 8px;">Packaging #${i + 1}</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <p><strong style="color: #c19725;">Product Code:</strong> ${p.product_code}</p>
                    <p><strong style="color: #c19725;">Material Name:</strong> ${p.material_name}</p>
                    <p><strong style="color: #c19725;">Category:</strong> ${p.material_categories}</p>
                    <p><strong style="color: #c19725;">Size:</strong> ${p.size}</p>
                    <p><strong style="color: #c19725;">Quantity:</strong> ${p.quantity}</p>
                    <p><strong style="color: #c19725;">Per Piece:</strong> ₹${p.per_piece}</p>
                    <p><strong style="color: #c19725;">Total Price:</strong> ₹${p.total_price}</p>
                    <p><strong style="color: #c19725;">Supplier Code:</strong> ${p.supplier_code}</p>
                  </div>
                </div>
              `).join('')
              : `<p>No packaging data found</p>`;

            const metalHtml = metalDataList.length > 0
              ? metalDataList.map((m: { artical_name: any; metal_type: any; unit: any; code: any; quantity: any; per_piece_weight: any; total_weight: any; per_piece_price: any; total_price: any; supplier_code: any; }, i: number) => `
                <div style="margin-bottom: 10px; border: 1px solid #ccc; padding: 10px; border-radius: 6px;">
                  <h4 style="color: #c19725; margin-bottom: 8px;">Metal #${i + 1}</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <p><strong style="color: #c19725;">Article Name:</strong> ${m.artical_name}</p>
                    <p><strong style="color: #c19725;">Metal Type:</strong> ${m.metal_type}</p>
                    <p><strong style="color: #c19725;">Unit:</strong> ${m.unit}</p>
                    <p><strong style="color: #c19725;">Code:</strong> ${m.code}</p>
                    <p><strong style="color: #c19725;">Quantity:</strong> ${m.quantity}</p>
                    <p><strong style="color: #c19725;">Per Piece Weight:</strong> ${m.per_piece_weight}</p>
                    <p><strong style="color: #c19725;">Total Weight:</strong> ${m.total_weight}</p>
                    <p><strong style="color: #c19725;">Per Piece Price:</strong> ₹${m.per_piece_price}</p>
                    <p><strong style="color: #c19725;">Total Price:</strong> ₹${m.total_price}</p>
                    <p><strong style="color: #c19725;">Supplier Code:</strong> ${m.supplier_code}</p>
                  </div>
                </div>
              `).join('')
              : `<p>No metal data found</p>`;

            const stoneHtml = stoneDataList.length > 0
              ? stoneDataList.map((s: { stone_name: any; categories: any; code: any; unit: any; quantity: any; per_piece_weight: any; total_weight: any; per_piece_price: any; total_price: any; supplier_code: any; }, i: number) => `
                <div style="margin-bottom: 10px; border: 1px solid #ccc; padding: 10px; border-radius: 6px;">
                  <h4 style="color: #c19725; margin-bottom: 8px;">Stone #${i + 1}</h4>
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <p><strong style="color: #c19725;">Stone Name:</strong> ${s.stone_name}</p>
                    <p><strong style="color: #c19725;">Category:</strong> ${s.categories}</p>
                    <p><strong style="color: #c19725;">Code:</strong> ${s.code}</p>
                    <p><strong style="color: #c19725;">Unit:</strong> ${s.unit}</p>
                    <p><strong style="color: #c19725;">Quantity:</strong> ${s.quantity}</p>
                    <p><strong style="color: #c19725;">Per Piece Weight:</strong> ${s.per_piece_weight}</p>
                    <p><strong style="color: #c19725;">Total Weight:</strong> ${s.total_weight}</p>
                    <p><strong style="color: #c19725;">Per Piece Price:</strong> ₹${s.per_piece_price}</p>
                    <p><strong style="color: #c19725;">Total Price:</strong> ₹${s.total_price}</p>
                    <p><strong style="color: #c19725;">Supplier Code:</strong> ${s.supplier_code}</p>
                  </div>
                </div>
              `).join('')
              : `<p>No stone data found</p>`;

              Swal.fire({
                title: `<strong style="font-size: 20px; color: #c19725;">Product Details</strong>`,
                html: `
                  <div style="font-size: 14px; height: 600px; overflow-y: auto; font-family: 'Segoe UI', sans-serif;">
                    <!-- Tabs Header -->
                    <ul class="nav nav-tabs" style="display: flex; border-bottom: 1px solid #ccc; padding: 0; margin-bottom: 15px;">
                      <li style="flex: 1;"><a class="tab-link active" href="#general-tab" style="display: block; padding: 10px; text-align: center; background: #fdf5e4; color: #c19725; text-decoration: none;">General</a></li>
                      <li style="flex: 1;"><a class="tab-link" href="#packaging-tab" style="display: block; padding: 10px; text-align: center; background: #e6f4ff; color: #1976d2; text-decoration: none;">Packaging</a></li>
                      <li style="flex: 1;"><a class="tab-link" href="#metal-tab" style="display: block; padding: 10px; text-align: center; background: #fce4ec; color: #8e24aa; text-decoration: none;">Metal</a></li>
                      <li style="flex: 1;"><a class="tab-link" href="#stone-tab" style="display: block; padding: 10px; text-align: center; background: #f3e5f5; color: #2e7d32; text-decoration: none;">Stone</a></li>
                    </ul>

                    <!-- Tabs Content -->
                    <div id="general-tab" class="tab-content active">
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">${generalHtml}</div>
                    </div>
                    <div id="packaging-tab" class="tab-content" style="display: none;">
                      <div>${packagingHtml}</div>
                    </div>
                    <div id="metal-tab" class="tab-content" style="display: none;">
                      <div>${metalHtml}</div>
                    </div>
                    <div id="stone-tab" class="tab-content" style="display: none;">
                      <div>${stoneHtml}</div>
                    </div>
                  </div>
                `,
                showCloseButton: true,
                focusConfirm: false,
                confirmButtonText: '<span style="color: white;">Close</span>',
                width: '900px',
                scrollbarPadding: false,
                customClass: {
                  popup: 'product-details-popup',
                  confirmButton: 'product-confirm-button'
                },
                didOpen: () => {
                  // Tab switching logic
                  const tabLinks = document.querySelectorAll('.tab-link');
                  const tabContents = document.querySelectorAll('.tab-content');

                  tabLinks.forEach((tab, index) => {
                    tab.addEventListener('click', (e) => {
                      e.preventDefault();

                      tabLinks.forEach(t => t.classList.remove('active'));
                      tabContents.forEach(c => (c as HTMLElement).style.display = 'none');

                      tab.classList.add('active');
                      (tabContents[index] as HTMLElement).style.display = 'block';
                    });
                  });

                  // Remove focus from confirm button
                  (document.activeElement as HTMLElement)?.blur();
                }
              });
          });
        });
      });
    });
  }

  public resolveValue(obj: any, key: string): string {
    if (!obj) {
      return '-';
    }

    if (key === 'category.name' && obj.category && obj.category.name) {
      return obj.category.name;
    }

    if (key === 'sub_category_id' && obj.sub_category_id) {
      const subCategory = this.generalData.find(
        (data: any) => data.id === obj.sub_category_id
      );
      return subCategory && subCategory.name ? subCategory.name : obj.sub_category_id;
    }

    try {
      const value = key.split('.').reduce((o, k) => (o ? o[k] : null), obj);
      return value !== null && value !== undefined && value !== ''
        ? String(value)
        : '-';
    } catch {
      return '-';
    }
  }
}
