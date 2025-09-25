import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { NotificationService } from '../../../../Services/notification.service';

@Component({
  selector: 'app-assigne',
  imports: [
    NgIf,
    NgFor,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './assigne.component.html',
  styleUrl: './assigne.component.css',
})
export class AssigneComponent implements OnInit {
  deleteMetal(arg0: any) {
    throw new Error('Method not implemented.');
  }
  totalPages: any;
  searchValues: { [key: string]: string } = {};
  globalSearchText: any;
  sortDirection: 'asc' | 'desc' = 'asc';
  sortKey: string = '';
  showDropdown: boolean = false;


  paginatedAssigneList: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  assigneDataList: any[] = [];
  assigneService: any;

  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const savedSelections = localStorage.getItem('assigneColumnSelections');
    if (savedSelections) {
      this.selectedFields = JSON.parse(savedSelections);
    }

    this.visibleRowCount = 10;
    this.itemsPerPage = this.visibleRowCount;

    this.getAssigneDataList();
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

  deleteAssigneEntry(id: any) {
    this.assigneService.deleteAssigneEntry(id).subscribe(
      (response: any) => {
        this.notificationService.showSuccess(
          'Assigne entry deleted successfully!',
          'Success'
        );
        this.getAssigneDataList();
      },
      (error: any) => {
        this.notificationService.showError(
          'Failed to delete assigne entry. Please try again.',
          'Error'
        );
      }
    );
  }

  getAssigneDataList() {
    this.assigneDataList = [
      {
        st_id: 1,
        st_item_name: 'Gold Necklace',
        st_item_code: 'GN1001',
        st_quantity: 2,
        st_assign_to: '',
        selectedAssignee: '',
      },
      {
        st_id: 2,
        st_item_name: 'Silver Ring',
        st_item_code: 'SR2002',
        st_quantity: 5,
        st_assign_to: '',
        selectedAssignee: '',
      },
      {
        st_id: 3,
        st_item_name: 'Diamond Earrings',
        st_item_code: 'DE3003',
        st_quantity: 1,
        st_assign_to: '',
        selectedAssignee: '',
      },
      {
        st_id: 4,
        st_item_name: 'Platinum Bracelet',
        st_item_code: 'PB4004',
        st_quantity: 3,
        st_assign_to: '',
        selectedAssignee: '',
      },
    ];

    this.filterTable();
  }

  openPackagingDetails(id: number): void {
    this.assigneService.getAssigneEntryById(id).subscribe(
      (response: any) => {
        const assigneEntry = response.data;

        const rows = this.selectedFields
          .filter((field) => field.selected)
          .map((field) => {
            let value = assigneEntry[field.key];
            if (field.subKey && typeof value === 'object' && value !== null) {
              value = value[field.subKey];
            }
            return `<p><strong>${field.label}:</strong> ${value ?? '-'}</p>`;
          })
          .join('');

        Swal.fire({
          title: `<strong style="font-size: 20px; color: #c19725;">Assigned Product Details</strong>`,
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
            confirmButton: 'packaging-confirm-button',
          },
        });
      },
      (error: any) => {
        console.error('Error fetching assigne details', error);
        Swal.fire(
          'Error',
          'Unable to fetch assigned product details. Please try again.',
          'error'
        );
      }
    );
  }

  get paginatedStockList() {
    return this.paginatedAssigneList;
  }
  set paginatedStockList(value: any[]) {
    this.paginatedAssigneList = value;
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
  printTable() {
    let printContent = `<html><head>
    <style>
      table { border-collapse: collapse; width: 100%; font-size: 12px; }
      th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
    </style>
  </head><body>
    <h3>Assigned Product List</h3>
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

    this.paginatedAssigneList.forEach((item, index) => {
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
  applyColumnSelection() {
    localStorage.setItem(
      'assigneColumnSelections',
      JSON.stringify(this.selectedFields)
    );
    this.showDropdown = false;
  }
  restoreColumnSelection() {
    localStorage.removeItem('assigneColumnSelections');
    this.selectedFields = [
      { key: 'st_item_name', label: 'Product Name', selected: true },
      { key: 'st_item_code', label: 'Product Code', selected: true },
      { key: 'st_quantity', label: 'Quantity', selected: true },
      { key: 'st_assign_to', label: 'Assign to', selected: true },
    ];
    this.filterTable();
  }
  deselectAllFields() {
    this.selectedFields.forEach((field) => (field.selected = false));
    this.saveSelectedFields();
  }
  selectAllFields() {
    this.selectedFields.forEach((field) => (field.selected = true));
    this.saveSelectedFields();
  }

  selectedFields: {
    key: string;
    label: string;
    selected: boolean;
    subKey?: string;
  }[] = [
    { key: 'st_item_name', label: 'Product Name', selected: true },
    { key: 'st_item_code', label: 'Product Code', selected: true },
    { key: 'st_quantity', label: 'Quantity', selected: true },
    { key: 'st_assign_to', label: 'Assign to', selected: true },
  ];

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }
  downloadCSV() {
    const data = this.paginatedAssigneList || [];

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
    const fileName = 'assigne-list.csv';

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();

    URL.revokeObjectURL(link.href);
  }
  downloadJSONAll() {
    const data = this.paginatedAssigneList || [];
    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = 'assigne-list.json';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
  }
  downloadExcel() {
    const selectedFields = this.selectedFields.filter(
      (field) => field.selected
    );

    const data = this.paginatedAssigneList.map((item, index) => {
      const row: any = { 'No.': index + 1 };
      selectedFields.forEach((field) => {
        row[field.label] = item[field.key] ?? '';
      });
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Assigne List': worksheet },
      SheetNames: ['Assigne List'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileName = 'assigne-list.xlsx';
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(dataBlob, fileName);
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

    const data = this.paginatedAssigneList.map((item, index) => {
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

    doc.save('assigne-list.pdf');
  }
  filterTable() {
    let filtered = this.assigneDataList.filter((item) => {
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

    if (this.sortKey) {
      filtered.sort((a, b) => {
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
    this.paginatedAssigneList = filtered.slice(
      start,
      start + this.itemsPerPage
    );
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
  }
  visibleRowCount: any;
  updateVisibleRows() {
    this.itemsPerPage = this.visibleRowCount;
    this.currentPage = 1;
    this.filterTable();
  }


  onFieldToggle(field: any) {
    field.selected = !field.selected;
    this.saveSelectedFields();
    this.filterTable();
  }

  saveSelectedFields() {
    localStorage.setItem(
      'assigneColumnSelections',
      JSON.stringify(this.selectedFields)
    );
  }

  updatePaginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedAssigneList = this.assigneDataList.slice(start, end);
  }

  assigneeList: string[] = [
    'Ravi Kumar',
    'Priya Mehta',
    'Amit Sharma',
    'Neha Sinha',
  ];

  assignProductToUser(item: any) {
    if (!item.selectedAssignee) {
      this.notificationService.showError('Please select an assignee.', 'Error');
      return;
    }

    console.log(
      `Assigning Product ${item.st_item_name} to ${item.selectedAssignee}`
    );

    this.notificationService.showSuccess(
      `Product "${item.st_item_name}" assigned to ${item.selectedAssignee}`,
      'Assigned'
    );

    item.st_assign_to = item.selectedAssignee;

  }

  get pageNumbers(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  editpackage() {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    throw new Error('Method not implemented.');
  }

  assignNotification(item: any) {
    if (item.selectedAssignee) {

      this.notificationService.showSuccess(
        `${item.selectedAssignee} assigned successfully!`,
        'Assignment Done'
      );
    } else {
      this.notificationService.showWarning(
        'Please select an assignee before assigning.',
        'Missing Selection'
      );
    }
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
      ).filter((el) => !el.hasAttribute('disabled') && el.tabIndex !== -1);

      const index = focusable.indexOf(target);
      if (index > -1 && index + 1 < focusable.length) {
        focusable[index + 1].focus();
      }
    }
  }
}
