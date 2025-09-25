import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReadyProductService } from '../../../../Services/Ready-Product/ready-product.service';
import { HttpParams } from '@angular/common/http';
import { NotificationService } from '../../../../Services/notification.service';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import autoTable from 'jspdf-autotable'; // For PDF export
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import FileSaver from 'file-saver'; // For file saving

@Component({
  selector: 'app-ready-product-list',
  standalone: true,
  imports: [NgFor, RouterLink, FormsModule,NgIf],
  templateUrl: './ready-product-list.component.html',
  styleUrl: './ready-product-list.component.css',
})
export class ReadyProductListComponent implements OnInit {
  paginatedStockList: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  readyProductList: any[] = []; // Initialize as an empty array

  // New properties for filtering, sorting, and column selection
  searchValues: { [key: string]: string } = {};
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showDropdown: boolean = false;
  globalSearchText: string = '';

  // Define the default set of fields for ready products
  defaultFields = [
    { key: 'rproduct_date', label: 'Date', selected: true },
    { key: 'rproduct_firm_id', label: 'Firm ID', selected: true },
    { key: 'rproduct_supplier_name', label: 'Supplier Name', selected: true },
    { key: 'rproduct_supplier_code', label: 'Supplier Code', selected: true },
    {
      key: 'rproduct_supplier_product_code',
      label: 'Supplier Product Code',
      selected: true,
    },
    { key: 'rproduct_unit', label: 'Unit', selected: true },
    { key: 'rproduct_categories', label: 'Categories', selected: true },
    { key: 'rproduct_subcategories', label: 'Subcategories', selected: true },
    { key: 'rproduct_name', label: 'Name', selected: true },
    { key: 'rproduct_code', label: 'Code', selected: true },
    {
      key: 'rproduct_silver_rate_per_gm',
      label: 'Silver Rate/GM',
      selected: true,
    },
    { key: 'rproduct_per_gram_labour', label: 'Per Gram Labour', selected: true },
    { key: 'rproduct_shipping_per_gm', label: 'Shipping/GM', selected: true },
    {
      key: 'rproduct_other_expense_per_gm',
      label: 'Other Expense/GM',
      selected: true,
    },
    { key: 'rproduct_packaging_cost', label: 'Packaging Cost', selected: true },
    {
      key: 'rproduct_per_gm_cost_without_packaging',
      label: 'Cost/GM (No Packaging)',
      selected: true,
    },
    { key: 'rproduct_packaging_stock', label: 'Packaging Stock', selected: true },
    { key: 'rproduct_quantity', label: 'Quantity', selected: true },
    { key: 'rproduct_total_wt', label: 'Total Weight', selected: true },
    // { key: 'rproduct_image', label: 'Image', selected: true }, // Images typically not displayed directly in table
    // { key: 'rproduct_image_display', label: 'Image Display', selected: true },
    { key: 'rproduct_stonetype', label: 'Stone Type', selected: true },
    { key: 'rproduct_stone_color', label: 'Stone Color', selected: true },
    { key: 'rproduct_polishtype', label: 'Polish Type', selected: true },
    { key: 'rproduct_sizeadjust', label: 'Size Adjust', selected: true },
    { key: 'rproduct_carat', label: 'Carat', selected: true },
    { key: 'rproduct_per_carat_price', label: 'Price/Carat', selected: true },
    { key: 'rproduct_total_carat_price', label: 'Total Carat Price', selected: true },
    { key: 'rproduct_stone_price', label: 'Stone Price', selected: true },
    { key: 'rproduct_size', label: 'Size', selected: true },
  ];

  selectedFields: any[] = [];
  titleTag : boolean = true;

  constructor(
    private readyProductService: ReadyProductService,
    private notificationService: NotificationService
  ) {}

  router = inject(Router);

  ngOnInit(): void {
    this.loadSelectedFields();
    this.getReadyProductList();
    this.hideTitle();
  }

  hideTitle(){
    const currentUrl = this.router.url;
    if(currentUrl.includes('report')){
      this.titleTag = false;
    }
  }

  loadSelectedFields() {
    const readyProductSelection = localStorage.getItem('readyProductSelected');
    if (readyProductSelection) {
      // Parse the stored JSON
      const storedFields = JSON.parse(readyProductSelection);

      // Create a map for quick lookup of stored field selections
      const storedFieldMap = new Map(storedFields.map((field: any) => [field.key, field.selected]));

      // Initialize selectedFields based on defaultFields, applying stored selections
      this.selectedFields = this.defaultFields.map(defaultField => ({
        ...defaultField,
        selected: storedFieldMap.has(defaultField.key)
          ? storedFieldMap.get(defaultField.key)
          : defaultField.selected // Use default if not found in storage
      }));
    } else {
      // If no stored preferences, use the default fields
      this.selectedFields = [...this.defaultFields];
    }
  }

  saveSelectedFields() {
    localStorage.setItem('readyProductSelected', JSON.stringify(this.selectedFields));
  }

  getReadyProductList() {
    this.readyProductService.getReadyProducts(new HttpParams()).subscribe(
      (response: any) => {
        if (response?.data?.length) {
          this.readyProductList = response.data.reverse();
          this.filterTable(); // Apply filters and pagination after fetching data
        } else {
          this.readyProductList = [];
          this.paginatedStockList = [];
          this.totalPages = 0;
        }
      },
      (error: any) => {
        this.notificationService.showError(
          'Failed to fetch ready products.',
          'Error'
        );
        this.readyProductList = [];
        this.paginatedStockList = [];
        this.totalPages = 0;
      }
    );
  }

  deleteReadyProduct(id: any): void {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this ready product?'
    );
    if (confirmDelete) {
      this.readyProductService.deleteReadyProduct(id).subscribe(
        (response: any) => {
          this.notificationService.showSuccess(
            'Ready product deleted successfully!',
            'Success'
          );
          this.getReadyProductList(); // Re-fetch and re-filter
        },
        (error: any) => {
          this.notificationService.showError(
            'Failed to delete ready product. Please try again.',
            'Error'
          );
        }
      );
    }
  }

  editReadyProduct(id: any) {
    // Implement navigation or modal for editing, similar to StoneStockComponent if needed
  }


  filterTable() {
    let filtered = this.readyProductList.filter((item: any) => {
      const matchesFieldFilters = this.selectedFields.every((field) => {
        // Only consider fields that are currently selected for individual column search
        if (!field.selected) return true;

        const searchTerm = (this.searchValues[field.key] || '')
          .trim()
          .toLowerCase();
        if (!searchTerm) return true;

        const fieldValue = (item[field.key] ?? '').toString().toLowerCase();
        return fieldValue.includes(searchTerm);
      });

      const matchesGlobalSearch = this.globalSearchText
        ? Object.values(item).some((val) =>
            (val ?? '')
              .toString()
              .toLowerCase()
              .includes(this.globalSearchText.trim().toLowerCase())
          )
        : true;

      return matchesFieldFilters && matchesGlobalSearch;
    });

    if (this.sortKey) {
      filtered.sort((a: any, b: any) => {
        const valA = a[this.sortKey] ?? '';
        const valB = b[this.sortKey] ?? '';
        return this.sortDirection === 'asc'
          ? valA > valB
            ? 1
            : valA < valB
            ? -1
            : 0
          : valA < valB
          ? 1
          : valA > valB
          ? -1
          : 0;
      });
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1); // Ensure current page is valid

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStockList = filtered.slice(start, start + this.itemsPerPage);
  }

  sortBy(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.filterTable();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.filterTable();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterTable(); // Re-apply filter to update pagination
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterTable();
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterTable();
    }
  }

  get pageNumbers(): number[] {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5;

    if (this.totalPages <= maxPagesToShow) {
      for (let i = 1; i <= this.totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Show ellipsis if current page is far from the start
      if (this.currentPage > 2) {
        pageNumbers.push(-1); // Sentinel for '...'
      }

      // Determine range of pages around current page
      let start = Math.max(2, this.currentPage - Math.floor(maxPagesToShow / 2) + 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + Math.floor(maxPagesToShow / 2) - 1);

      // Adjust range if current page is near start or end
      if (this.currentPage <= Math.floor(maxPagesToShow / 2) + 1) {
        end = Math.min(this.totalPages - 1, maxPagesToShow - 1);
      }
      if (this.currentPage >= this.totalPages - Math.floor(maxPagesToShow / 2)) {
        start = Math.max(2, this.totalPages - maxPagesToShow + 2);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // Show ellipsis if current page is far from the end
      if (this.currentPage < this.totalPages - 1) {
        if (pageNumbers[pageNumbers.length - 1] !== this.totalPages && pageNumbers[pageNumbers.length - 1] !== -1) {
             pageNumbers.push(-1); // Sentinel for '...'
        }
      }

      // Always show last page if not already in the visible range
      if (!pageNumbers.includes(this.totalPages) && this.totalPages > 1) {
          pageNumbers.push(this.totalPages);
      }
    }

    // Filter out duplicate -1 (ellipsis) and ensure page numbers are unique and sorted
    const uniquePageNumbers = Array.from(new Set(pageNumbers)).sort((a,b) => a - b);
    return uniquePageNumbers;
  }


  selectAllFields() {
    this.selectedFields.forEach((field) => (field.selected = true));
    this.saveSelectedFields();
    this.filterTable(); // Re-apply filter to show/hide columns
  }

  deselectAllFields() {
    this.selectedFields.forEach((field) => (field.selected = false));
    this.saveSelectedFields();
    this.filterTable(); // Re-apply filter to show/hide columns
  }

  get selectedFieldss() {
    return this.selectedFields.filter((field) => field.selected);
  }

  applyColumnSelection() {
    this.saveSelectedFields();
    this.showDropdown = false;
    this.filterTable(); // Re-apply filter to update the table display
  }

  downloadPDF(): void {
    const doc = new jsPDF('l', 'mm', 'a4');

    const selectedFields = this.selectedFields.filter(
      (field) => field.selected
    );

    const headers = [
      { header: 'No.', dataKey: 'no' },
      ...selectedFields.map((field) => ({
        header: field.label,
        dataKey: field.key,
      })),
    ];

    const data = this.paginatedStockList.map((item, index) => {
      const row: any = { no: index + 1 };
      selectedFields.forEach((field) => {
        row[field.key] = this.getDisplayValue(item[field.key]);
      });
      return row;
    });

    autoTable(doc, {
      columns: headers,
      body: data,
      styles: {
        fontSize: 6,
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
      tableWidth: 'wrap',
      horizontalPageBreak: true,
      pageBreak: 'auto',
      didDrawPage: (dataArg) => {
        const pageSize = doc.internal.pageSize;
        const pageHeight = pageSize.height;

        doc.setFontSize(8);
        doc.text(
          `Page ${(doc as any).getNumberOfPages()}`,
          pageSize.width - 20,
          pageHeight - 10
        );
      },
    });

    doc.save('ready-product-list.pdf');
  }

  downloadExcel(): void {
    const selectedFields = this.selectedFields.filter(
      (field) => field.selected
    );

    const data = this.paginatedStockList.map((item, index) => {
      const row: any = { 'No.': index + 1 };
      selectedFields.forEach((field) => {
        row[field.label] = this.getDisplayValue(item[field.key]);
      });
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Ready Product List': worksheet },
      SheetNames: ['Ready Product List'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileName = 'ready-product-list.xlsx';
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(dataBlob, fileName);
  }

  downloadJSONAll(): void {
    const data = this.paginatedStockList || [];

    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = 'ready-product-list.json';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  downloadCSV(): void {
    const data = this.paginatedStockList || [];

    if (!data.length) return;

    const selectedFields = this.selectedFields?.filter((f) => f.selected) || [];
    const headers = ['No.', ...selectedFields.map((f) => f.label)];
    const keys = selectedFields.map((f) => f.key);

    let csvContent = headers.join(',') + '\n';

    data.forEach((item, index) => {
      const row = [
        index + 1,
        ...keys.map((key) => {
          const value = this.getDisplayValue(item[key]);
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value ?? '';
        }),
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = 'ready-product-list.csv';

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();

    URL.revokeObjectURL(link.href);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  restoreColumnSelection() {
    localStorage.removeItem('readyProductSelected');
    this.selectedFields = [...this.defaultFields]; // Restore from the default set
    this.filterTable(); // Re-apply filter
  }

  printTable() {
    let printContent = `<html><head>
        <style>
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head><body>
        <h3>Ready Product List</h3>
        <table>
          <thead>
            <tr>
              <th>No.</th>`;

    this.selectedFields.forEach((field) => {
      if (field.selected) {
        printContent += `<th>${field.label}</th>`;
      }
    });

    printContent += `</tr></thead><tbody>`;

    this.paginatedStockList.forEach((item, index) => {
      printContent += `<tr>
          <td>${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>`;

      this.selectedFields.forEach((field) => {
        if (field.selected) {
          printContent += `<td>${this.getDisplayValue(item[field.key])}</td>`;
        }
      });
      printContent += `</tr>`;
    });

    printContent += `</tbody></table></body></html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  onFieldToggle(field: any) {
    // The [(ngModel)] handles the field.selected change directly.
    // We just need to save the state and re-filter.
    this.saveSelectedFields();
    this.filterTable();
  }

  // Removed the 'subKey' parameter since it's not needed for any fields in ReadyProductList
  getDisplayValue(value: any): string {
    if (value == null) return '';
    return String(value);
  }
}
