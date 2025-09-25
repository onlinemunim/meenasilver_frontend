import { StockService } from './../../../../Services/Stock/stock.service';
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

// Assuming these services exist and are correctly implemented for packaging
import { ApiService } from '../../../../Services/api.service';
import { NotificationService } from '../../../../Services/notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-packaging-list',
  standalone: true, // Mark as standalone
  imports: [NgFor, FormsModule, NgIf, RouterLink],
  templateUrl: './packaging-list.component.html',
  styleUrl: './packaging-list.component.css'
})
export class PackagingListComponent implements OnInit {

  paginatedPackagingList: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  packagingList: any[] = [];
  globalSearchText: any;
  searchValues: { [key: string]: string } = {};
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  showDropdown: boolean = false;
  visibleRowCount: any;

  selectedFields = [
    { key: 'st_item_name', label: 'Name', selected: true },
    { key: 'st_item_code', label: 'Packaging Code', selected: true },
    { key: 'st_item_category', label: ' Category', selected: true, subKey: 'name' },
    { key: 'st_quantity', label: 'Quantity', selected: true },
    { key: 'st_unit_price', label: 'Price', selected: true },
    { key: 'st_final_valuation', label: 'final value', selected: true },
    // { key: 'st_product_code_type', label: 'Packaging Type', selected: true },
    { key: 'st_supplier_code', label: 'Supplier Code', selected: true },
    { key: 'st_supplier_bill_no', label: 'bill no ', selected: true },
    { key: 'st_packaging_date', label: 'Packaging date', selected: true },
  ];

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private StockService: StockService
  ) {}

  ngOnInit(): void {
    const savedSelections = localStorage.getItem('packagingColumnSelections');
    if (savedSelections) {
      this.selectedFields = JSON.parse(savedSelections);
    }
    this.getPackagingList();
    this.filterTable(); // Call filterTable after data is loaded and selections are restored
  }

  // --- Data Retrieval and Pagination ---

  getPackagingList() {
    this.StockService.getStockEntries().subscribe((response: any) => {
      if (response?.data?.length) {
        this.packagingList = response.data
          .filter((item: any) => item.st_product_code_type === 'packaging')
          .sort((a: any, b: any) => b.id - a.id);
          console.log('Packaging List:', this.packagingList);

        this.totalPages = Math.ceil(this.packagingList.length / this.itemsPerPage);
        this.currentPage = 1;
        this.filterTable();
      } else {
        this.packagingList = [];
        this.paginatedPackagingList = [];
        this.totalPages = 0;
      }
    },
    (error) => {
        console.error('Error fetching packaging list:', error);
        this.notificationService.showError('Failed to load packaging list.', 'Error');
        this.packagingList = [];
        this.paginatedPackagingList = [];
        this.totalPages = 0;
    });
  }

  updatePaginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedPackagingList = this.packagingList.slice(start, end);
  }



  filterTable() {
    let filtered = this.packagingList.filter(item => {
      const matchesFieldFilters = this.selectedFields.every(field => {
        const searchTerm = (this.searchValues[field.key] || '').trim().toLowerCase();
        if (!searchTerm) return true;

        const fieldValue = (item[field.key] ?? '').toString().toLowerCase();
        return fieldValue.includes(searchTerm);
      });

      const matchesGlobalSearch = this.globalSearchText
        ? Object.values(item).some(val =>
            (val ?? '').toString().toLowerCase().includes(this.globalSearchText.trim().toLowerCase())
          )
        : true;

      return matchesFieldFilters && matchesGlobalSearch;
    });

    if (this.sortKey) {
      filtered.sort((a, b) => {
        const valA = a[this.sortKey] ?? '';
        const valB = b[this.sortKey] ?? '';
        return this.sortDirection === 'asc'
          ? valA > valB ? 1 : valA < valB ? -1 : 0
          : valA < valB ? 1 : valA > valB ? -1 : 0;
      });
    }

    // Recalculate total pages based on filtered data
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    // Ensure current page is valid after filtering
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedPackagingList = filtered.slice(start, start + this.itemsPerPage);
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

  // --- Column Visibility and Persistence ---

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  applyColumnSelection() {
    localStorage.setItem('packagingColumnSelections', JSON.stringify(this.selectedFields));
    this.showDropdown = false;
    this.filterTable(); // Re-filter to update visible columns in the table
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

  restoreColumnSelection() {
    localStorage.removeItem('packagingColumnSelections');
    // Reset to default selected fields
    this.selectedFields = [
      { key: 'st_item_name', label: 'ID', selected: true },
      { key: 'st_item_category', label: ' Category', selected: true, subKey: 'name'},
      { key: 'st_item_code', label: 'item code', selected: true },
      { key: 'st_quantity', label: 'Quantity', selected: true },
      { key: 'st_unit_price', label: 'Price', selected: true },
      { key: 'st_final_valuation', label: 'final value', selected: true },
      // { key: 'st_product_code_type', label: 'Type', selected: true },
      { key: 'st_supplier_code', label: 'Supplier Code', selected: true },
      { key: 'st_packaging_date', label: 'Packaging date', selected: true },
      { key: 'st_supplier_bill_no', label: 'bill no ', selected: true },
    ];
    this.filterTable();
  }

  onFieldToggle(field: any) {
    field.selected = !field.selected;
    this.saveSelectedFields();
    this.filterTable();
  }

  saveSelectedFields() {
    localStorage.setItem('packagingColumnSelections', JSON.stringify(this.selectedFields));
  }

  get selectedFieldss() { // Renamed to avoid conflict if `selectedFields` is also used as a getter elsewhere
    return this.selectedFields.filter((field) => field.selected);
  }

  // --- Pagination Controls ---

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
    // Generate an array of page numbers to display in pagination controls
    const pages: number[] = [];
    const maxPagesToShow = 5; // Adjust as needed
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // --- Export and Print Functionality ---

  downloadPDF(): void {
    const doc = new jsPDF('l', 'mm', 'a4');

    const selectedFields = this.selectedFields.filter((field) => field.selected);

    const headers = [
      { header: 'No.', dataKey: 'no' },
      ...selectedFields.map((field) => ({
        header: field.label,
        dataKey: field.key,
      })),
    ];

    const data = this.paginatedPackagingList.map((item, index) => {
      const row: any = { no: (this.currentPage - 1) * this.itemsPerPage + index + 1 };
      selectedFields.forEach((field) => {
        row[field.key] = item[field.key] ?? '';
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

    doc.save('packaging-list.pdf');
  }

  downloadExcel(): void {
    const selectedFields = this.selectedFields.filter(field => field.selected);

    const data = this.paginatedPackagingList.map((item, index) => {
      const row: any = { 'No.': (this.currentPage - 1) * this.itemsPerPage + index + 1 };
      selectedFields.forEach(field => {
        row[field.label] = item[field.key] ?? '';
      });
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Packaging List': worksheet },
      SheetNames: ['Packaging List']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const fileName = 'packaging-list.xlsx';
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });
    FileSaver.saveAs(dataBlob, fileName);
  }

  downloadJSONAll(): void {
    const data = this.paginatedPackagingList || [];

    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = 'packaging-list.json';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  downloadCSV(): void {
    const data = this.paginatedPackagingList || [];

    if (!data.length) return;

    const selectedFields = this.selectedFields?.filter(f => f.selected) || [];
    const headers = ['No.', ...selectedFields.map(f => f.label)];
    const keys = selectedFields.map(f => f.key);

    let csvContent = headers.join(',') + '\n';

    data.forEach((item, index) => {
      const row = [
        (this.currentPage - 1) * this.itemsPerPage + index + 1,
        ...keys.map(key => {
          const value = item[key];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value ?? '';
        }),
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = 'packaging-list.csv';

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();

    URL.revokeObjectURL(link.href);
  }

  printTable() {
    let printContent = `<html><head>
      <style>
        table { border-collapse: collapse; width: 100%; font-size: 12px; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head><body>
      <h3>Packaging List</h3>
      <table>
        <thead>
          <tr>
            <th>No.</th>`;

    this.selectedFields.forEach(field => {
      if (field.selected) {
        printContent += `<th>${field.label}</th>`;
      }
    });

    printContent += `</tr></thead><tbody>`;

    this.paginatedPackagingList.forEach((item, index) => {
      printContent += `<tr>
        <td>${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>`;

      this.selectedFields.forEach(field => {
        if (field.selected) {
          printContent += `<td>${item[field.key] ?? ''}</td>`;
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

  openPackagingDetails(id: number): void {
    this.StockService.getStockEntryById(id).subscribe(
      (response: any) => {
        const packaging = response.data;

        // Dynamically generate rows based on selected fields
        const rows = this.selectedFields
          .filter(field => field.selected)
          .map(field => {
            const value = packaging[field.key] ?? '-';
            return `<p><strong>${field.label}:</strong> ${value}</p>`;
          })
          .join('');

        Swal.fire({
          title: `<strong style="font-size: 20px; color: #c19725;">Packaging Details</strong>`,
          html: `
            <div style="text-align: left; font-size: 14px; max-height: 70vh; overflow-y: auto; font-family: 'Segoe UI', sans-serif;">
              <section style="margin-bottom: 1.5rem;">
                <h3 style="background: #fdf5e4; color: #c19725; padding: 6px 10px; border-left: 4px solid #c19725;">Item Info</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding-top: 8px;">
                  ${rows}
                </div>
              </section>
            </div>
          `,
          showCloseButton: true,
          focusConfirm: false,
          confirmButtonText: '<span style="color: white;">Close</span>',
          width: '650px',
          scrollbarPadding: false,
          customClass: {
            popup: 'packaging-details-popup',
            confirmButton: 'packaging-confirm-button'
          }
        });
      },
      (error) => {
        console.error('Error fetching packaging details', error);
        Swal.fire('Error', 'Unable to fetch packaging details. Please try again.', 'error');
      }
    );
  }


  deletePackaging(id: any) {
    this.apiService.delete(`stocks/${id}`).subscribe(
      (response: any) => {
        this.notificationService.showSuccess('Packaging item deleted successfully!', 'Success');
        this.getPackagingList();
      },
      (error: any) => {
        this.notificationService.showError('Failed to delete packaging item. Please try again.', 'Error');
      }
    );
  }
}
