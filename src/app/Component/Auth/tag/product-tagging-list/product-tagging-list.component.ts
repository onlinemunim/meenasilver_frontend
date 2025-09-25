import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { TaggingService } from '../../../../Services/Tagging/tagging.service';
import { NgFor, NgIf } from '@angular/common';
import { NotificationService } from '../../../../Services/notification.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-tagging-list',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './product-tagging-list.component.html',
  styleUrl: './product-tagging-list.component.css'
})
export class ProductTaggingListComponent implements OnInit, OnDestroy {
  taggingsList: any[] = [];
  paginatedTaggingsList: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;

  searchValues: { [key: string]: string } = {};
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  showDropdown: boolean = false;
  globalSearchText: string = '';
  titleTag: boolean = true;

  private tagCreatedSubscription!: Subscription;

  defaultFields = [
    { key: 'std_barcode', label: 'Barcode', selected: true },
    { key: 'std_item_code', label: 'Parent Code', selected: true },
    { key: 'std_item_name', label: 'Product Name', selected: true },
    { key: 'std_item_category', label: 'Category', selected: true },
    { key: 'std_stone_type', label: 'Stone Type', selected: true },
    { key: 'std_item_size', label: 'Size', selected: true },
    { key: 'std_net_weight', label: 'Weight', selected: true },
    { key: 'std_unit_price', label: 'MRP', selected: true },
    { key: 'std_rate_list_code', label: 'Rate List Code', selected: false },
  ];

  selectedFields: any[] = [];

  constructor(
    private taggingService: TaggingService,
    private notificationService: NotificationService
  ) { }

  router = inject(Router);

  ngOnInit(): void {
    this.loadSelectedFields();
    this.getTaggingList();
    this.hideTitle();

    this.tagCreatedSubscription = this.taggingService.tagCreated$.subscribe(() => {
      console.log('Received tag creation notification. Refreshing list...');
      this.getTaggingList();
    });
  }

  ngOnDestroy(): void {
    if (this.tagCreatedSubscription) {
      this.tagCreatedSubscription.unsubscribe();
    }
  }

  hideTitle() {
    const currentUrl = this.router.url;
    if (currentUrl.includes('report')) {
      this.titleTag = false;
    }
  }

  loadSelectedFields() {
    const taggingSelection = localStorage.getItem('taggingSelected');
    if (taggingSelection) {
      const storedFields = JSON.parse(taggingSelection);
      const storedFieldMap = new Map(storedFields.map((field: any) => [field.key, field.selected]));
      this.selectedFields = this.defaultFields.map(defaultField => ({
        ...defaultField,
        selected: storedFieldMap.has(defaultField.key)
          ? storedFieldMap.get(defaultField.key)
          : defaultField.selected
      }));
    } else {
      this.selectedFields = [...this.defaultFields];
    }
  }

  saveSelectedFields() {
    localStorage.setItem('taggingSelected', JSON.stringify(this.selectedFields));
  }

  getTaggingList() {
    this.taggingService.getTaggings().subscribe({
      next: (response: any) => {
        if (response?.data?.length) {
          this.taggingsList = response.data.sort((a: any, b: any) => b.std_id - a.std_id);
          this.filterTable();
        } else {
          this.taggingsList = [];
          this.paginatedTaggingsList = [];
          this.totalPages = 0;
        }
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to fetch tagged items.', 'Error');
        this.taggingsList = [];
        this.paginatedTaggingsList = [];
        this.totalPages = 0;
      }
    });
  }

  deleteTag(id: any) {
    if (!id) {
        this.notificationService.showError('Invalid ID, cannot delete.', 'Error');
        return;
    }
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this tagged item? This will add the quantity and weight back to the parent product.'
    );
    if (confirmDelete) {
      this.taggingService.deleteTagging(id).subscribe({
        next: (res: any) => {
          this.notificationService.showSuccess('Item deleted and stock rolled back!', 'Success');
          this.getTaggingList();
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to delete item. Please try again.', 'Error');
        }
      });
    }
  }

  viewTag(tagData: any) {
    const fieldsToShow = this.defaultFields.filter(f => f.selected);
    const htmlContent = fieldsToShow.map(field => {
      const value = tagData[field.key] ?? '—';
      return `<tr>
                <td style="padding: 5px 10px; text-align: left; font-weight: 600;">${field.label}</td>
                <td style="padding: 5px 10px; text-align: right;">${value}</td>
              </tr>`;
    }).join('');

    Swal.fire({
      title: '<span style="color:goldenrod;">Tagged Information</span>',
      html: `
        <table style="width:100%; font-size:14px;">
          ${htmlContent}
        </table>
      `,
      confirmButtonColor: '#d4af37',
      confirmButtonText: 'Close',
      background: '#fffbe6',
      width: '500px',
      showClass: {
        popup: 'swal2-show swal2-animate-popup'
      },
      hideClass: {
        popup: 'swal2-hide swal2-animate-popup'
      }
    });
  }

  filterTable() {
    let filtered = this.taggingsList.filter((item: any) => {
      const matchesFieldFilters = this.selectedFields.every((field) => {
        if (!field.selected) return true;
        const searchTerm = (this.searchValues[field.key] || '').trim().toLowerCase();
        if (!searchTerm) return true;
        const fieldValue = (item[field.key] ?? '').toString().toLowerCase();
        return fieldValue.includes(searchTerm);
      });

      const matchesGlobalSearch = this.globalSearchText
        ? Object.values(item).some((val) =>
            (val ?? '').toString().toLowerCase().includes(this.globalSearchText.trim().toLowerCase())
          )
        : true;

      return matchesFieldFilters && matchesGlobalSearch;
    });

    if (this.sortKey) {
      filtered.sort((a: any, b: any) => {
        const valA = a[this.sortKey] ?? '';
        const valB = b[this.sortKey] ?? '';
        const comparison = valA > valB ? 1 : valA < valB ? -1 : 0;
        return this.sortDirection === 'asc' ? comparison : -comparison;
      });
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedTaggingsList = filtered.slice(start, start + this.itemsPerPage);
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

  get pageNumbers(): (number | string)[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const maxPagesToShow = 5;
    const pages: (number | string)[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 2) {
          startPage = 2;
          endPage = 3;
      }
      if (currentPage >= totalPages - 1) {
          startPage = totalPages - 2;
          endPage = totalPages - 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
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
    this.saveSelectedFields();
    this.showDropdown = false;
    this.filterTable();
  }

  downloadPDF(): void {
    const doc = new jsPDF('l', 'mm', 'a4');
    const selectedFields = this.selectedFields.filter((field) => field.selected);
    const headers = [['No.', ...selectedFields.map(field => field.label)]];
    const data = this.paginatedTaggingsList.map((item, index) => [
      index + 1,
      ...selectedFields.map(field => this.getDisplayValue(item[field.key]))
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' }
    });
    doc.save('tagged-products.pdf');
  }

  downloadExcel(): void {
    const selectedFields = this.selectedFields.filter((field) => field.selected);
    const data = this.paginatedTaggingsList.map((item, index) => {
      const row: any = { 'No.': index + 1 };
      selectedFields.forEach((field) => {
        row[field.label] = this.getDisplayValue(item[field.key]);
      });
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'tagged-products.xlsx');
  }

  downloadJSONAll(): void {
    const jsonString = JSON.stringify(this.paginatedTaggingsList, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    FileSaver.saveAs(blob, 'tagged-products.json');
  }

  downloadCSV(): void {
    const selectedFields = this.selectedFields.filter((f) => f.selected);
    const headers = ['No.', ...selectedFields.map((f) => f.label)];
    let csvContent = headers.join(',') + '\n';
    this.paginatedTaggingsList.forEach((item, index) => {
      const row = [
        index + 1,
        ...selectedFields.map(field => {
          const value = this.getDisplayValue(item[field.key]);
          return `"${value.replace(/"/g, '""')}"`;
        })
      ];
      csvContent += row.join(',') + '\n';
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, 'tagged-products.csv');
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  restoreColumnSelection() {
    localStorage.removeItem('taggingSelected');
    this.selectedFields = [...this.defaultFields];
  }

  printTable() {
    const selectedFields = this.selectedFields.filter(field => field.selected);
    let printContent = `
      <style>
        table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        h3 { font-family: sans-serif; }
      </style>
      <h3>Tagged Product List</h3>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            ${selectedFields.map(field => `<th>${field.label}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${this.paginatedTaggingsList.map((item, index) => `
            <tr>
              <td>${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>
              ${selectedFields.map(field => `<td>${this.getDisplayValue(item[field.key])}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>`;
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  }

  onFieldToggle(field: any) {
    this.saveSelectedFields();
  }

  getDisplayValue(value: any): string {
    if (value === null || value === undefined) return '';
    return String(value);
  }
}
