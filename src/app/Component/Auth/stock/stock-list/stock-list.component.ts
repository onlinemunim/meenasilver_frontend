import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { NotificationService } from '../../../../Services/notification.service';
import { Router, RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import autoTable from 'jspdf-autotable'; // For PDF export
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import FileSaver from 'file-saver'; // For file saving
import { StockService } from '../../../../Services/Stock/stock.service';
@Component({
  selector: 'app-stock-list',
  standalone: true,
  imports: [NgFor, RouterLink, FormsModule, NgIf],
  templateUrl: './stock-list.component.html',
  styleUrl: './stock-list.component.css',
})
export class StockListComponent implements OnInit {
  paginatedStockList: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  stockList: any[] = [];
  searchValues: { [key: string]: string } = {};
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showDropdown: boolean = false;
  globalSearchText: string = '';

  // Define the default set of fields for stock products based on your rules
  defaultFields = [
    //{ key: 'st_owner_id', label: 'Owner ID', selected: true },
    //{ key: 'st_firm_id', label: 'Firm ID', selected: true },
    { key: 'st_item_code', label: 'Item Code', selected: true },
    { key: 'st_metal_type', label: 'Metal Type', selected: true },
    { key: 'st_product_type', label: 'Product Type', selected: true },
    { key: 'st_item_name', label: 'Item Name', selected: true, subkey: 'name' },
    { key: 'st_item_category', label: 'Item Category', selected: true , subKey: 'name' },
    // { key: 'st_barcode', label: 'Barcode', selected: true },

    { key: 'st_quantity', label: 'Quantity', selected: true },
    { key: 'st_purity', label: 'Purity', selected: true },
    { key: 'st_color', label: 'Color', selected: true },
    { key: 'tag_status', label: 'Tag Status', selected: true },
    { key:'st_total_wt' , label: 'Total Weight', selected: true },
  ];

  selectedFields: any[] = [];
  titleTag: boolean = true;

  constructor(
    private stockService: StockService, // Use the new service
    private notificationService: NotificationService
  ) {}

  router = inject(Router);

  ngOnInit(): void {
    this.loadSelectedFields();
    this.getStockList();
    this.hideTitle();
  }

  hideTitle() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('report')) {
      this.titleTag = false;
    }
  }

  loadSelectedFields() {
    const stockSelection = localStorage.getItem('Stocksselectedfeilds');
    if (stockSelection) {
      // Parse the stored JSON
      const storedFields = JSON.parse(stockSelection);

      const storedFieldMap = new Map(
        storedFields.map((field: any) => [field.key, field.selected])
      );

      this.selectedFields = this.defaultFields.map((defaultField) => ({
        ...defaultField,
        selected: storedFieldMap.has(defaultField.key)
          ? storedFieldMap.get(defaultField.key)
          : defaultField.selected,
      }));
    } else {
      this.selectedFields = [...this.defaultFields];
    }
  }

  saveSelectedFields() {
    localStorage.setItem(
      'stockSelectedfielditem',
      JSON.stringify(this.selectedFields)
    );
  }

  getStockList() {
    this.stockService.getStockEntries(new HttpParams()).subscribe(
      (response: any) => {
        console.log('Stock List Response:', response);
        if (response?.data?.length) {
          this.stockList = response.data.reverse();
          this.filterTable(); // Apply filters and pagination after fetching data
        } else {
          this.stockList = [];
          this.paginatedStockList = [];
          this.totalPages = 0;
        }
      },
      (error: any) => {
        this.notificationService.showError(
          'Failed to fetch stock entries.',
          'Error'
        );
        this.stockList = [];
        this.paginatedStockList = [];
        this.totalPages = 0;
      }
    );
  }

  editStock(id: any) {
    // Implement navigation or modal for editing if needed
  }

  filterTable() {
    let filtered = this.stockList.filter((item: any) => {
      const matchesFieldFilters = this.selectedFields.every((field) => {
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
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

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
      this.filterTable();
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
      pageNumbers.push(1);

      if (this.currentPage > 2) {
        pageNumbers.push(-1);
      }
      let start = Math.max(
        2,
        this.currentPage - Math.floor(maxPagesToShow / 2) + 1
      );
      let end = Math.min(
        this.totalPages - 1,
        this.currentPage + Math.floor(maxPagesToShow / 2) - 1
      );
      if (this.currentPage <= Math.floor(maxPagesToShow / 2) + 1) {
        end = Math.min(this.totalPages - 1, maxPagesToShow - 1);
      }
      if (
        this.currentPage >=
        this.totalPages - Math.floor(maxPagesToShow / 2)
      ) {
        start = Math.max(2, this.totalPages - maxPagesToShow + 2);
      }

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }
      if (this.currentPage < this.totalPages - 1) {
        if (
          pageNumbers[pageNumbers.length - 1] !== this.totalPages &&
          pageNumbers[pageNumbers.length - 1] !== -1
        ) {
          pageNumbers.push(-1);
        }
      }
      if (!pageNumbers.includes(this.totalPages) && this.totalPages > 1) {
        pageNumbers.push(this.totalPages);
      }
    }

    const uniquePageNumbers = Array.from(new Set(pageNumbers)).sort(
      (a, b) => a - b
    );
    return uniquePageNumbers;
  }

  get allFieldsSelected(): boolean {
    return this.selectedFields.every((field) => field.selected);
  }

  get noFieldsSelected(): boolean {
    return this.selectedFields.every((field) => !field.selected);
  }

  selectAllFields() {
    this.selectedFields.forEach((field) => (field.selected = true));
    this.saveSelectedFields();
    this.filterTable();
  }

  deselectAllFields() {
    this.selectedFields.forEach((field) => (field.selected = false));
    this.saveSelectedFields();
    this.filterTable();
  }

  get selectedFieldss() {
    return this.selectedFields.filter((field) => field.selected);
  }

  applyColumnSelection() {
    this.saveSelectedFields();
    this.showDropdown = false;
    this.filterTable();
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

    doc.save('stock-list.pdf');
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
      Sheets: { 'Stock List': worksheet },
      SheetNames: ['Stock List'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileName = 'stock-list.xlsx';
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(dataBlob, fileName);
  }

  downloadJSONAll(): void {
    const data = this.paginatedStockList || [];

    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = 'stock-list.json';

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
    const fileName = 'stock-list.csv';

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();

    URL.revokeObjectURL(link.href);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  restoreColumnSelection() {
    localStorage.removeItem('stockSelected');
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
        <h3>Stock List</h3>
        <table>
          <thead>
            <tr>
              <th>No.</th>`;

    this.selectedFieldss.forEach((field) => {
      printContent += `<th>${field.label}</th>`;
    });

    printContent += `</tr></thead><tbody>`;

    this.paginatedStockList.forEach((item, index) => {
      printContent += `<tr>
          <td>${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>`;

      this.selectedFieldss.forEach((field) => {
        printContent += `<td>${this.getDisplayValue(item[field.key])}</td>`;
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
    this.saveSelectedFields();
    this.filterTable();
  }

  getDisplayValue(value: any): string {
    if (value == null) return '';
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return String(value);
  }
}
