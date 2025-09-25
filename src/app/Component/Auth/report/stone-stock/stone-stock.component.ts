import { NgFor, NgIf } from '@angular/common'; // Import NgStyle
import { Component, OnInit } from '@angular/core';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { NotificationService } from '../../../../Services/notification.service';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import FileSaver from 'file-saver';

@Component({
  selector: 'app-stone-stock',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, RouterLink], // Add NgStyle here
  templateUrl: './stone-stock.component.html',
  styleUrl: './stone-stock.component.css',
})
export class StoneStockComponent implements OnInit {

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

  // Getter property to resolve the 'stockCards' error in the template
  public get stockCards(): any[] {
    return this.paginatedStockList;
  }

  searchValues: { [key: string]: string } = {};
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showDropdown: boolean = false;
  defaultFields: any;
  visibleRowCount: any;

  constructor(
    private rawmetalservice: RawMetalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const stoneselection = localStorage.getItem('stoneselected');
    if(stoneselection)
      {
      this.selectedFields = JSON.parse(stoneselection);
      }

    this.getRawStoneList();
  }

  getRawStoneList() {
    this.rawmetalservice.getRawMetalEntries().subscribe((response: any) => {
      if (response?.data?.length) {
        this.rawStonelist = response.data.reverse()
          .filter((item: any) => item.st_product_code_type === 'raw_stone')
          .sort((a: any, b: any) => b.id - a.id);

        this.totalPages = Math.ceil(this.rawStonelist.length / this.itemsPerPage);
        this.currentPage = 1;
        this.filterTable();
        this.updatePaginatedList();
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

  selectedFields = [
      { key: 'st_item_category', label: 'Category', selected: true , subKey: 'name'},
      { key: 'st_item_name', label: 'Name', selected: true },
      { key: 'st_item_size', label: 'Size', selected: true },
      { key: 'st_item_code', label: 'Code', selected: true },
      { key: 'st_quantity', label: 'Quantity', selected: true },
      { key: 'st_subunit', label: 'Per Stone Each mala', selected: true },
      { key: 'st_unit_quantity', label: 'Total Mala', selected: true },
      { key: 'st_sub_unit_price', label: 'Per Stone Price', selected: true },
      { key: 'st_total_wt', label: 'Total Weight', selected: true },
      { key: 'st_unit_price', label: 'Per Gram Price', selected: true },
      { key: 'st_subunit', label: 'Per Stone Weight', selected: true },
  ];

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
    this.paginatedStockList = this.rawStonelist.slice(
      0,
      this.visibleRowCount
    );
  }

  getDisplayValue(value: any, subKey?: string): string {
    if (value == null) return '';

    if (typeof value === 'object') {
      return subKey && value[subKey] != null ? value[subKey] : JSON.stringify(value);
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
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedStockList = this.rawStonelist.slice(start, end);
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
    localStorage.setItem('stoneselected', JSON.stringify(this.selectedFields));
    this.showDropdown = false;
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

    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = 'product-list.json';

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
    const fileName = 'product-list.csv';

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();

    URL.revokeObjectURL(link.href);
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  restoreColumnSelection() {
    localStorage.removeItem('stoneselected');
    this.selectedFields = [
      { key: 'st_item_category', label: 'Category', selected: true , subKey: 'name'},
      { key: 'st_item_name', label: 'Name', selected: true },
      { key: 'st_item_size', label: 'Size', selected: true },
      { key: 'st_item_code', label: 'Code', selected: true },
      { key: 'st_quantity', label: 'Quantity', selected: true },
      { key: 'st_subunit', label: 'Per Stone Each mala', selected: true },
      { key: 'st_unit_quantity', label: 'Total Mala', selected: true },
      { key: 'st_sub_unit_price', label: 'Per Stone Price', selected: true },
      { key: 'st_total_wt', label: 'Total Weight', selected: true },
      { key: 'st_unit_price', label: 'Per Gram Price', selected: true },
      { key: 'st_subunit', label: 'Per Stone Weight', selected: true },
    ];
    this.filterTable();
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
  onFieldToggle(field: any) {
    field.selected = !field.selected;
    this.saveSelectedFields();
    this.filterTable();
  }

  saveSelectedFields() {
    localStorage.setItem('selectedFields', JSON.stringify(this.selectedFields));
  }
}
