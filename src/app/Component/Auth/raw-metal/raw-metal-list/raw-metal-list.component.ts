import { Component, OnInit } from '@angular/core';
import { RawMetalEntryComponent } from '../raw-metal-entry/raw-metal-entry.component';
import { NgFor, NgIf } from '@angular/common';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { ApiService } from '../../../../Services/api.service';
import { NotificationService } from '../../../../Services/notification.service';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-raw-metal-list',
  imports: [NgFor,FormsModule,NgIf,RouterLink],
  templateUrl: './raw-metal-list.component.html',
  styleUrl: './raw-metal-list.component.css',
})
export class RawMetalListComponent implements OnInit {

  paginatedStockList: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  // rawMetallist: any;
  rawmetaldata: any;
  rawmetalId: any;
  rawMetalProductId: any;
  rawMetalEntryForm: any;

  showDropdown: boolean = false;
  ultFields: any[] = [];

searchValues: { [key: string]: string } = {};
sortKey: string = '';
sortDirection: 'asc' | 'desc' = 'asc';

rawMetallist: any[] = [];
item: any;
globalSearchText: any;
defaultFields: any[] = [];
visibleRowCount: any;
// Filtered + Paginated

  constructor(
    private rawmetalservice: RawMetalService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {

    const savedSelections = localStorage.getItem('columnSelections');
  if (savedSelections) {
    this.selectedFields = JSON.parse(savedSelections);
  }
    this.getRawMetalList();
    this.filterTable();

  }
  updatePaginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedStockList = this.rawMetallist.slice(start, end);
  }

  getRawMetalList() {
    this.rawmetalservice.getRawMetalEntries().subscribe((response: any) => {
      if (response?.data?.length) {
        console.log('Raw metal data:', response.data);
        this.rawMetallist = response.data
          .filter((item: any) => item.st_product_code_type === 'raw_metal')
          .sort((a: any, b: any) => b.id - a.id);

        this.totalPages = Math.ceil(this.rawMetallist.length / this.itemsPerPage);
        this.currentPage = 1;
        this.updatePaginatedList();
      } else {
        this.rawMetallist = [];
        this.paginatedStockList = [];
        this.totalPages = 0;
      }
    });
  }


  deleteMetal(id: any)
  {
    this.rawmetalservice.deleteRawMetalEntry(id).subscribe(
      (response: any) => {
        this.notificationService.showSuccess('Raw metal deleted successfully!', 'Success');
        this.getRawMetalList();
      },
      (error: any) => {
        this.notificationService.showError('Failed to delete raw metal. Please try again.', 'Error');
      }
    );


  }

  updateVisibleRows() {
    this.paginatedStockList = this.rawMetallist.slice(
      0,
      this.visibleRowCount
    );
  }


  selectedFields: { key: string; label: string; selected: boolean; subKey?: string }[] = [
    { key: 'st_item_code', label: 'Code', selected: true }
    ,{ key: 'st_metal_type', label: 'Metal Type', selected: true },
    { key: 'st_item_name', label: 'Name', selected: true },
    { key: 'st_item_size', label: 'Size', selected: true },
    { key: 'st_subunit', label: 'Per peice weight', selected: true },
    {key: 'st_avg_subunit', label: 'Avg Per peice weight', selected: true},
    { key: 'st_total_wt', label: 'Total Weight', selected: true },
    { key: 'st_quantity', label: 'Quantity', selected: true },
    { key: 'st_metal_rate', label: 'Metal Rate', selected: true },
    { key: 'st_avg_metal_rate', label: 'Avg Metal Rate', selected: true },
    { key: 'st_unit_price', label: 'Per piece silver price', selected: true },
    { key: 'st_avg_unit_price', label: 'Avg Per piece silver price', selected: true },
    { key: 'st_per_gm_labour', label: 'Per Gram Labour', selected: true },
    { key: 'st_avg_per_gm_labour', label: 'Avg Per Gram Labour', selected: true },
    { key: 'st_per_piece_labour', label: 'Per piece Labour', selected: true },
    { key: 'st_avg_per_piece_labour', label: 'Avg Per piece Labour', selected: true },
    { key: 'st_per_gm_shipping', label: 'Per Gram Shipping', selected: true },
    { key: 'st_avg_per_gm_shipping', label: 'Avg Per Gram Shipping', selected: true },
    { key: 'st_per_piece_shipping', label: 'Per Peice Shipping price', selected: true },
    { key: 'st_avg_per_piece_shipping', label: ' Avg Per Peice Shipping price', selected: true },
    { key: 'st_sub_unit_price', label: 'Per Piece total price', selected: true },
    { key: 'st_avg_sub_unit_price', label: 'Avg Per Piece total price', selected: true },

  ];



  filterTable() {
    console.log('Filtering started...');
    console.log('Raw metal list:', this.rawMetallist);
    console.log('Global search text:', this.globalSearchText);

    let filtered = this.rawMetallist.filter(item => {
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

    console.log('Filtered list:', filtered);

    // Apply sorting if needed
    if (this.sortKey) {
      filtered.sort((a, b) => {
        const valA = a[this.sortKey] ?? '';
        const valB = b[this.sortKey] ?? '';
        return this.sortDirection === 'asc'
          ? valA > valB ? 1 : valA < valB ? -1 : 0
          : valA < valB ? 1 : valA > valB ? -1 : 0;
      });
    }

    // Pagination
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStockList = filtered.slice(start, start + this.itemsPerPage);
    console.log('Paginated list:', this.paginatedStockList);
  }



  applyColumnSelection() {
    localStorage.setItem('columnSelections', JSON.stringify(this.selectedFields));
    this.showDropdown = false;
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

  formatNumber(value: any): string {
    const num = parseFloat(value);
    return isNaN(num) ? '-' : num.toFixed(2);
  }

  formatFieldValue(item: any, field: any): string {
    const value = field.subKey ? item[field.key]?.[field.subKey] : item[field.key];

    if (value == null || value === '') return '-';

    const isNumeric = !isNaN(value) && typeof value !== 'object';
    return isNumeric ? this.formatNumber(value) : value;
  }

  selectAllFields()
  {
    this.selectedFields.forEach((field) => (field.selected = true));
  }

  deselectAllFields()
  {
    this.selectedFields.forEach((field) => (field.selected = false));
  }


  get selectedFieldss() {
    return this.selectedFields.filter((field) => field.selected);
  }

  downloadPDF(): void {

    const doc = new jsPDF('l', 'mm', 'a4');

    // Filter only selected fields
    const selectedFields = this.selectedFields.filter((field) => field.selected);

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
      tableWidth: 'wrap',          // Wrap to content
      horizontalPageBreak: true,   // Break if too wide
      pageBreak: 'auto',           // Auto paginate
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
    const selectedFields = this.selectedFields.filter(field => field.selected);

    const data = this.paginatedStockList.map((item, index) => {
      const row: any = { 'No.': index + 1 };
      selectedFields.forEach(field => {
        row[field.label] = item[field.key] ?? '';
      });
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Product List': worksheet },
      SheetNames: ['Product List']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const fileName = 'product-list.xlsx';
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
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
    const selectedFields = this.selectedFields?.filter(f => f.selected) || [];
    const headers = ['No.', ...selectedFields.map(f => f.label)];
    const keys = selectedFields.map(f => f.key);

    // Build CSV content
    let csvContent = headers.join(',') + '\n';

    data.forEach((item, index) => {
      const row = [
        index + 1,
        ...keys.map(key => {
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


  toggleDropdown()
  {
    this.showDropdown = !this.showDropdown;
  }


  restoreColumnSelection()
  {
    localStorage.removeItem('columnSelections');
  this.selectedFields = [
    { key: 'st_item_code', label: 'Code', selected: true }
    ,{ key: 'st_metal_type', label: 'Metal Type', selected: true },
    { key: 'st_item_name', label: 'Name', selected: true },
    { key: 'st_item_size', label: 'Size', selected: true },
    { key: 'st_subunit', label: 'Per peice weight', selected: true },
    {key: 'st_avg_subunit', label: 'Avg Per peice weight', selected: true},
    { key: 'st_total_wt', label: 'Total Weight', selected: true },
    { key: 'st_quantity', label: 'Quantity', selected: true },
    { key: 'st_metal_rate', label: 'Metal Rate', selected: true },
    { key: 'st_avg_metal_rate', label: 'Avg Metal Rate', selected: true },
    { key: 'st_unit_price', label: 'Per piece silver price', selected: true },
    { key: 'st_avg_unit_price', label: 'Avg Per piece silver price', selected: true },
    { key: 'st_per_gm_labour', label: 'Per Gram Labour', selected: true },
    { key: 'st_avg_per_gm_labour', label: 'Avg Per Gram Labour', selected: true },
    { key: 'st_per_piece_labour', label: 'Per piece Labour', selected: true },
    { key: 'st_avg_per_piece_labour', label: 'Avg Per piece Labour', selected: true },
    { key: 'st_per_gm_shipping', label: 'Per Gram Shipping', selected: true },
    { key: 'st_avg_per_gm_shipping', label: 'Avg Per Gram Shipping', selected: true },
    { key: 'st_per_piece_shipping', label: 'Per Peice Shipping price', selected: true },
    { key: 'st_avg_per_piece_shipping', label: ' Avg Per Peice Shipping price', selected: true },
    { key: 'st_sub_unit_price', label: 'Per Piece total price', selected: true },
    { key: 'st_avg_sub_unit_price', label: 'Avg Per Piece total price', selected: true },
  ];
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

    // Add visible column headers
    this.selectedFields.forEach(field => {
      if (field.selected) {
        printContent += `<th>${field.label}</th>`;
      }
    });

    printContent += `</tr></thead><tbody>`;


    // Add data rows
    this.paginatedStockList.forEach((item, index) => {
      printContent += `<tr>
        <td>${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>`;

      this.selectedFields.forEach(field => {
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


  openPackagingDetails(id: number): void {
    this.rawmetalservice.getRawMetalEntryById(id).subscribe(
      (response: any) => {
        const packaging = response.data;

        // Dynamically generate rows based on selected fields
        const rows = this.selectedFields
          .filter(field => field.selected)
          .map(field => {
            let value = packaging[field.key];

            // Handle nested object field (like st_item_category)
            if (field.subKey && typeof value === 'object' && value !== null) {
              value = value[field.subKey];
            }

            return `<p><strong>${field.label}:</strong> ${value ?? '-'}</p>`;
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
}
