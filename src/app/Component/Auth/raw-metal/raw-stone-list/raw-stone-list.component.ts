import { filter } from 'rxjs';
import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { NotificationService } from '../../../../Services/notification.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import FileSaver from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-raw-stone-list',
  imports: [NgFor, FormsModule, NgIf, RouterLink],
  templateUrl: './raw-stone-list.component.html',
  styleUrl: './raw-stone-list.component.css',
})
export class RawStoneListComponent implements OnInit {
  paginatedStockList: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  rawStonelist: any;
  rawmetaldata: any;
  rawmetalId: any;
  rawMetalProductId: any;
  rawMetalEntryForm: any;
  item: any;

  searchValues: { [key: string]: string } = {};
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showDropdown: boolean = false;
  defaultFields: any;
  visibleRowCount: any;
  filteredStockList: any[] = [];

  constructor(
    private rawmetalservice: RawMetalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const savedMode = localStorage.getItem('stoneViewMode');
    this.selectedViewMode = 'all';
    console.log('asdfghj', savedMode);

    this.updateSelectedFields();

    this.getRawStoneList();
  }

  getRawStoneList() {
    this.rawmetalservice.getRawMetalEntries().subscribe((response: any) => {
      if (response?.data?.length) {
        this.rawStonelist = response.data
          .filter((item: any) => item.st_product_code_type === 'raw_stone')
          .sort((a: any, b: any) => b.id - a.id);

        this.totalPages = Math.ceil(
          this.rawStonelist.length / this.itemsPerPage
        );

        this.updatePaginatedList();

        this.filterByViewMode();
      } else {
        this.rawStonelist = [];
        this.paginatedStockList = [];
        this.totalPages = 0;
      }
    });
  }

  deleteMetal(id: any) {
    this.rawmetalservice.deleteRawMetalEntry(id).subscribe(
      (response: any) => {
        this.notificationService.showSuccess(
          'Raw Stone deleted successfully!',
          'Success'
        );
        this.getRawStoneList();
      },
      (error: any) => {
        this.notificationService.showError(
          'Failed to delete raw Stone. Please try again.',
          'Error'
        );
      }
    );
  }

  selectedViewMode: string = 'byLine';

  selectedFields: any[] = [];


  filterByViewMode() {
    if (!this.rawStonelist || !Array.isArray(this.rawStonelist)) {
      return;
    }

    if (this.selectedViewMode === 'all') {
      this.filteredStockList = [...this.rawStonelist];
    } else if (this.selectedViewMode === 'byLine') {
      this.filteredStockList = this.rawStonelist.filter(
        (item) => item.st_product_type === 'By Line'
      );
    } else if (this.selectedViewMode === 'byStone') {
      this.filteredStockList = this.rawStonelist.filter(
        (item) => item.st_product_type === 'By Stone'
      );
    } else if (this.selectedViewMode === 'byGram') {
      this.filteredStockList = this.rawStonelist.filter(
        (item) => item.st_product_type === 'By Gram'
      );
    }


    this.updatePaginatedList();
  }

  updateSelectedFields(): void {

    localStorage.setItem('stoneViewMode', this.selectedViewMode);

    if (this.selectedViewMode === 'all') {
      this.selectedFields = [
        { key: 'st_item_code', label: 'Code', selected: true },
        { key: 'st_item_name', label: 'Name', selected: true },
        {
          key: 'st_item_category',
          label: 'Category',
          subKey: 'name',
          selected: true,
        },
        { key: 'st_product_type', label: 'Stone Type', selected: true },
        { key: 'st_item_size', label: 'Size', selected: true },
        { key: 'st_color', label: 'Color', selected: true },
        { key: 'st_unit_price', label: 'Total Price', selected: true },
        { key: 'st_total_wt', label: 'Total Stone WT', selected: true },
        {
          key: 'st_subunit',
          label: 'Total stone in Each line',
          selected: true,
        },
        { key: 'st_unit_quantity', label: 'Total Line', selected: true },
        { key: 'st_quantity', label: 'Quantity', selected: true },
        { key: 'st_unit_price', label: 'Per Line/Gram Price', selected: true },
        { key: 'st_sub_unit_price', label: 'Per Stone Price', selected: true },
        { key: 'created_at', label: 'Date', isDate: true, selected: true },
      ];
    } else if (this.selectedViewMode === 'byLine') {
      this.selectedFields = [
        {
          key: 'st_item_category',
          label: 'Category',
          selected: true,
          subKey: 'name',
        },
        { key: 'st_item_name', label: 'Name', selected: true },
        { key: 'st_item_code', label: 'Code', selected: true },
        { key: 'st_product_type', label: 'Stone Type', selected: true },
        { key: 'st_unit_price', label: 'Per Line Price', selected: true },
        {
          key: 'st_avg_unit_price',
          label: 'Avg Per line Price',
          selected: true,
        },
        { key: 'st_subunit', label: 'Per Stone in Each Line', selected: true },
        {
          key: 'st_avg_subunit',
          label: 'Avg Per Stone in Each Line',
          selected: true,
        },
        { key: 'st_unit_quantity', label: 'Total Line ', selected: true },
        {
          key: 'st_avg_unit_quantity',
          label: 'Avg Total Line',
          selected: true,
        },
        { key: 'st_quantity', label: 'Quantity', selected: true },
        { key: 'st_sub_unit_price', label: 'Per Stone Price', selected: true },
        {
          key: 'st_avg_sub_unit_price',
          label: 'Avg Per Stone Price',
          selected: true,
        },
        { key: 'created_at', label: 'Date', isDate: true, selected: true },
      ];
    } else if (this.selectedViewMode === 'byStone') {
      this.selectedFields = [
        {
          key: 'st_item_category',
          label: 'Category',
          selected: true,
          subKey: 'name',
        },
        { key: 'st_item_name', label: 'Name', selected: true },
        { key: 'st_item_code', label: 'Code', selected: true },
        { key: 'st_product_type', label: 'Stone Type', selected: true },
        { key: 'st_quantity', label: 'Quantity', selected: true },
        { key: 'st_sub_unit_price', label: 'Per Stone Price', selected: true },
        {
          key: 'st_avg_sub_unit_price',
          label: 'Avg Per Stone Price',
          selected: true,
        },
        { key: 'created_at', label: 'Date', isDate: true, selected: true },
      ];
    } else if (this.selectedViewMode === 'byGram') {
      this.selectedFields = [
        {
          key: 'st_item_category',
          label: 'Category',
          selected: true,
          subKey: 'name',
        },
        { key: 'st_item_name', label: 'Name', selected: true },
        { key: 'st_item_code', label: 'Code', selected: true },
        { key: 'st_product_type', label: 'Stone Type', selected: true },
        { key: 'st_subunit', label: 'Each Stone Weight', selected: true },
        {
          key: 'st_avg_subunit',
          label: 'Avg Per Stone Weight',
          selected: true,
        },
        { key: 'st_total_wt', label: 'Total Stone Weight', selected: true },
        { key: 'st_unit_price', label: 'Per Gram Price', selected: true },
        {
          key: 'st_avg_unit_price',
          label: 'Avg Per Gram Price',
          selected: true,
        },
        { key: 'st_quantity', label: 'Quantity', selected: true },
        { key: 'st_sub_unit_price', label: 'Per Stone Price', selected: true },
        {
          key: 'st_avg_sub_unit_price',
          label: 'Avg Per Stone Price',
          selected: true,
        },
        { key: 'created_at', label: 'Date', isDate: true, selected: true },
      ];
    }

    this.filterByViewMode();
  }

  filterTable() {
    console.log('Filtering started...');
    console.log('Raw metal list:', this.rawStonelist);
    console.log('Global search text:', this.globalSearchText);

    let filtered = this.rawStonelist.filter((item: any) => {
      const matchesFieldFilters = this.selectedFields.every((field) => {
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

    console.log('Filtered list:', filtered);

    // Apply sorting if needed
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

    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStockList = filtered.slice(start, start + this.itemsPerPage);
    console.log('Paginated list:', this.paginatedStockList);
  }
  globalSearchText: string = '';

  sortBy(key: string) {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.filterTable();
  }

  updateVisibleRows() {
    this.paginatedStockList = this.rawStonelist.slice(0, this.visibleRowCount);
  }

  getDisplayValue(value: any, subKey?: string): string {
    if (value == null) return '';

    if (typeof value === 'object') {
      return subKey && value[subKey] != null
        ? value[subKey]
        : JSON.stringify(value);
    }

    return String(value);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.filterTable();
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedList();
    }
  }

  updatePaginatedList() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedStockList = this.filteredStockList.slice(
      startIndex,
      endIndex
    );
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

  selectAllFields() {
    this.selectedFields.forEach((field) => (field.selected = true));
  }

  deselectAllFields() {
    this.selectedFields.forEach((field) => (field.selected = false));
  }

  get selectedFieldss() {
    return this.selectedFields.filter((field) => field.selected);
  }

  applyColumnSelection() {
    localStorage.setItem('stoneselected', JSON.stringify(this.selectedFields));
    this.showDropdown = false;
  }

  downloadPDF(): void {
    const doc = new jsPDF('l', 'mm', 'a4');

    // Filter only selected fields
    const selectedFields = this.selectedFields.filter(
      (field) => field.selected
    );

    // Set table headers including a serial number column
    const headers = [
      { header: 'No.', dataKey: 'no' },
      ...selectedFields.map((field) => ({
        header: field.label,
        dataKey: field.key,
      })),
    ];

    // Prepare table body data
    const data = this.paginatedStockList.map((item, index) => {
      const row: any = { no: index + 1 };
      selectedFields.forEach((field) => {
        row[field.key] = item[field.key] ?? ''; // Fill value or blank
      });
      return row;
    });

    // Create table with autoTable
    autoTable(doc, {
      columns: headers,
      body: data,
      styles: {
        fontSize: 6,
        cellPadding: 1.5,
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [0, 123, 255], // Bootstrap blue
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
      tableWidth: 'wrap', // Wrap to content
      horizontalPageBreak: true, // Break if too wide
      pageBreak: 'auto', // Auto paginate
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

    // Save as PDF
    doc.save('product-list.pdf');
  }

  downloadExcel(): void {
    const selectedFields = this.selectedFields.filter(
      (field) => field.selected
    );

    const data = this.paginatedStockList.map((item, index) => {
      const row: any = { 'No.': index + 1 };
      selectedFields.forEach((field) => {
        row[field.label] = item[field.key] ?? '';
      });
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Product List': worksheet },
      SheetNames: ['Product List'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileName = 'product-list.xlsx';
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(dataBlob, fileName);
  }

  downloadJSONAll(): void {
    const data = this.paginatedStockList || [];

    const jsonString = JSON.stringify(data, null, 2); // Pretty print with indentation

    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = 'product-list.json';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href); // Clean up
  }

  downloadCSV(): void {
    const data = this.paginatedStockList || [];

    if (!data.length) return;

    // Extract headers dynamically from the first object
    const selectedFields = this.selectedFields?.filter((f) => f.selected) || [];
    const headers = ['No.', ...selectedFields.map((f) => f.label)];
    const keys = selectedFields.map((f) => f.key);

    // Build CSV content
    let csvContent = headers.join(',') + '\n';

    data.forEach((item, index) => {
      const row = [
        index + 1,
        ...keys.map((key) => {
          const value = item[key];
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"` // Wrap comma-containing values in quotes
            : value ?? '';
        }),
      ];
      csvContent += row.join(',') + '\n';
    });

    // Trigger file download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = 'product-list.csv';

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();

    URL.revokeObjectURL(link.href); // Clean up
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  restoreColumnSelection() {
    localStorage.removeItem('stoneselected');
    this.selectedFields = [
      {
        key: 'st_item_category',
        label: 'Category',
        selected: true,
        subKey: 'name',
      },
      { key: 'st_metal_type', label: 'Metal Type', selected: true },
      { key: 'st_item_name', label: 'Name', selected: true },
      { key: 'st_item_size', label: 'Size', selected: true },
      { key: 'st_item_code', label: 'Code', selected: true },
      { key: 'st_quantity', label: 'Quantity', selected: true },
      { key: 'st_subunit', label: 'Per Stone in Each mala', selected: true },
      { key: 'st_unit_quantity', label: 'Total Mala', selected: true },
      { key: 'st_sub_unit_price', label: 'Per Stone price', selected: true },
      // { key: 'st_total_wt', label: 'Total Weight', selected: true },
      { key: 'st_unit_price', label: 'Per Gram Price', selected: true },
      { key: 'st_subunit', label: 'Per Stone Weight', selected: true },
    ];
  }

  printTable() {
    // Generate table HTML
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

    // Add visible column headers
    this.selectedFields.forEach((field) => {
      if (field.selected) {
        printContent += `<th>${field.label}</th>`;
      }
    });

    printContent += `</tr></thead><tbody>`;

    // Add data rows
    this.paginatedStockList.forEach((item, index) => {
      printContent += `<tr>
          <td>${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>`;

      this.selectedFields.forEach((field) => {
        if (field.selected) {
          printContent += `<td>${item[field.key] ?? ''}</td>`;
        }
      });

      // Placeholder for Action
    });

    printContent += `</tbody></table></body></html>`;

    // Open new window for print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  }
  onFieldToggle(field: any) {
    field.selected = !field.selected;
    this.saveSelectedFields();
    this.filterTable();
  }

  saveSelectedFields() {
    localStorage.setItem('selectedFields', JSON.stringify(this.selectedFields));
  }

  openStoneDetails(id: number): void {
    this.rawmetalservice.getRawMetalEntryById(id).subscribe(
      (response: any) => {
        const stone = response.data;

        const rows = this.selectedFields
          .filter((field) => field.selected)
          .map((field) => {
            let value = stone[field.key];

            if (field.subKey && typeof value === 'object' && value !== null) {
              value = value[field.subKey];
            }

            return `<p><strong>${field.label}:</strong> ${value ?? '-'}</p>`;
          })
          .join('');

        Swal.fire({
          title: `<strong style="font-size: 20px; color: #c19725;">Stone Details</strong>`,
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
            popup: 'stone-details-popup',
            confirmButton: 'stone-confirm-button',
          },
        });
      },
      (error) => {
        console.error('Error fetching stone details', error);
        Swal.fire(
          'Error',
          'Unable to fetch stone details. Please try again.',
          'error'
        );
      }
    );
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
}
