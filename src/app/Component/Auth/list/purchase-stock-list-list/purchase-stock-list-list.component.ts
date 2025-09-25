
import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { NotificationService } from '../../../../Services/notification.service';
// You can remove these imports if you are not using them for downloads
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
@Component({
  selector: 'app-purchase-stock-list-list',
  standalone: true,
  imports: [CommonModule, FormsModule, NgFor, NgIf, RouterLink],
  templateUrl: './purchase-stock-list-list.component.html',
  styleUrls: ['./purchase-stock-list-list.component.css'] // <-- Change from styleUrl to styleUrls (plural)
})

export class PurchaseStockListListComponent implements OnInit {

  paginatedStockList: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  rawStonelist: any[] = [];

  searchValues: { [key: string]: string } = {};
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  globalSearchText: string = '';

  constructor(
    private rawmetalservice: RawMetalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const storedFields = localStorage.getItem('stoneselected');
    if (storedFields) {
      this.selectedFields = JSON.parse(storedFields);
    }
    this.getRawStoneList();
  }

  public get visibleColumnCount(): number {
    if (!this.selectedFields) return 2;
    // We filter by `selected` property, assuming it still exists for potential future use
    const visibleFields = this.selectedFields.filter(field => field.selected).length;
    return visibleFields + 2;
  }

  getDisplayValue(item: any, field: any): string {
    if (field.subKey) {
      if (item && typeof item[field.key] === 'object' && item[field.key] !== null) {
        return item[field.key][field.subKey] ?? '';
      }
      return '';
    }
    return item[field.key] ?? '';
  }

  getRawStoneList() {
    this.rawmetalservice.getRawMetalEntries().subscribe((response: any) => {
      if (response?.data?.length) {
        this.rawStonelist = response.data
          .filter((item: any) => item.st_product_code_type === 'raw_stone')
          .sort((a: any, b: any) => b.id - a.id);
        this.filterTable();
      } else {
        this.rawStonelist = [];
        this.paginatedStockList = [];
        this.totalPages = 0;
      }
    });
  }

  filterTable() {
    let filteredData = [...this.rawStonelist];

    if (this.globalSearchText.trim()) {
      const globalTerm = this.globalSearchText.toLowerCase().trim();
      filteredData = filteredData.filter(item => Object.values(item).some(val => String(val).toLowerCase().includes(globalTerm)));
    }

    filteredData = filteredData.filter(item => this.selectedFields.every(field => {
        if (!field.selected) return true;
        const searchTerm = (this.searchValues[field.key] || '').toLowerCase().trim();
        if (!searchTerm) return true;
        const fieldValue = this.getDisplayValue(item, field).toLowerCase();
        return fieldValue.includes(searchTerm);
      }));

    if (this.sortKey) {
      filteredData.sort((a, b) => {
        const valA = this.getDisplayValue(a, { key: this.sortKey });
        const valB = this.getDisplayValue(b, { key: this.sortKey });
        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.totalPages = Math.ceil(filteredData.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStockList = filteredData.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onFilterChange() {
      this.currentPage = 1;
      this.filterTable();
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

  deleteMetal(id: any) {
    this.rawmetalservice.deleteRawMetalEntry(id).subscribe(
      () => {
        this.notificationService.showSuccess('Raw Stone deleted successfully!', 'Success');
        this.getRawStoneList();
      },
      () => {
        this.notificationService.showError('Failed to delete raw Stone.', 'Error');
      }
    );
  }
  selectedFields = [
    { key: 'Search Pid', label: 'Pid', selected: true },
    { key: 'Search Date', label: 'Date', selected: true },
    { key: 'Search Firm', label: 'Firm', selected: true },
    { key: 'Search Metal', label: 'Metal', selected: true },
    { key: 'Search Category', label: 'Category', selected: true },
    { key: 'Search Item Det', label: 'Item Det', selected: true },
    { key: 'Search Image', label: 'Image', selected: true },
    { key: 'Search Qty', label: 'Qty', selected: true },
    { key: 'Search Gs Wt', label: 'Gs Wt', selected: true },
    { key: 'Search Less Wt', label: 'Less Wt', selected: true },
    { key: 'Search Pkt Wt', label: 'Pkt Wt', selected: true },
    { key: 'Search Nt Wt', label: 'Nt Wt', selected: true },
    { key: 'Search P.r.', label: 'P.r.', selected: true },
    { key: 'Search Rate', label: 'Rate', selected: true },
    { key: 'Search Wtg', label: 'Wtg', selected: true },
    { key: 'Search Cust Wtg', label: 'Cust Wtg', selected: true },
    { key: 'Search Value Added Amt', label: 'Value Added Amt', selected: true },
    { key: 'Search Fn Wt', label: 'Fn Wt', selected: true },
    { key: 'Search Ffn Wt', label: 'Ffn Wt', selected: true },
    { key: 'Search Stone Wt', label: 'Stone Wt', selected: true },
  ];








  // selectedFields = [
  //   { key: 'Search Metal Type', label: 'Metal Type', selected: true , subKey: 'name'},
  //   { key: 'Search P.Code', label: 'P.Code', selected: true },
  //   { key: 'Search Item Category', label: 'Item Category', selected: true },
  //   { key: 'Search Item Name', label: 'Item Name', selected: true },
  //   { key: 'Search MIN.QTY', label: 'MIN.QTY', selected: true },
  //   { key: 'Search MAX.QTY', label: 'MAX.QTY', selected: true },
  //   { key: 'Search AVA.QTY', label: 'AVA.QTY', selected: true },
  //   { key: 'Search MIN.WT', label: 'MIN.WT', selected: true },
  //   { key: 'Search MAX.WT', label: 'MAX.WT', selected: true },
  //   { key: 'Search AVA.WT', label: 'AVA.WT', selected: true },
  //   ];
  goToPage(page: number) { if (page >= 1 && page <= this.totalPages) { this.currentPage = page; this.filterTable(); } }
  goToPreviousPage() { if (this.currentPage > 1) { this.currentPage--; this.filterTable(); } }
  goToNextPage() { if (this.currentPage < this.totalPages) { this.currentPage++; this.filterTable(); } }


  copyToClipboard() {
    alert('Copy clicked!');
  }

  exportCSV() {
    alert('CSV clicked!');
  }

  exportExcel() {
    alert('Excel clicked!');
  }

  exportJSON() {
    alert('JSON clicked!');
  }

  exportPDF() {
    alert('PDF clicked!');
  }

  printTable() {
    alert('Print clicked!');
  }


  printSelected() {
    alert('Print Selected clicked!');
  }

  toggleColumnVisibility() {
    alert('Column Visibility clicked!');
  }


  // --- CHANGE: All button methods are now simple placeholders without popups ---

  // copyData() { alert('Copy button clicked!'); }
  // downloadCSV() { alert('Download CSV button clicked!'); }
  // downloadExcel() { alert('Download Excel button clicked!'); }
  // downloadJSONAll() { alert('Download JSON button clicked!'); }
  // downloadPDF() { alert('Download PDF button clicked!'); }
  // printTable() { alert('Print Table button clicked!'); }

  // This function is now a simple placeholder
  toggleDropdown() {
    alert('Column Visibility button clicked!');
  }

}

