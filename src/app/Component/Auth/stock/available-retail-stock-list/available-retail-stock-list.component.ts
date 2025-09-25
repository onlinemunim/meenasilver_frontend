import { StockService } from './../../../../Services/Stock/stock.service';
// src/app/components/available-retail-stock-list/available-retail-stock-list.component.ts
import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// For PDF export
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// For Excel export
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

import { NotificationService } from '../../../../Services/notification.service'; // Adjust path


@Component({
  selector: 'app-available-retail-stock-list',
  standalone: true,
  imports: [NgFor, FormsModule, NgIf, RouterLink],
  templateUrl: './available-retail-stock-list.component.html',
  styleUrl: './available-retail-stock-list.component.css'
})
export class AvailableRetailStockListComponent implements OnInit {

  // --- Component Properties ---
  paginatedStockList: any[] = [];
  retailStockList: any[] = []; // Holds the full, unfiltered data from the service
  // Properties for pagination
  currentPage = 1;
  itemsPerPage = 10; // Default items per page
  totalPages = 0;
  visibleRowCount: number; // Directly bound to the 'Rows' select dropdown

  // Properties for filtering/searching
  globalSearchText: string = '';
  searchValues: { [key: string]: string } = {}; // For column-specific searches

  // Properties for sorting
  sortKey: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  // Properties for column visibility
  showDropdown: boolean = false;
  // This array defines all possible columns and their initial visibility
  // IMPORTANT: This should be a copy or immutable initial state if you modify `selectedFields`
  // directly without creating a new array reference when restoring.
  // For simplicity and direct modification with [(ngModel)], we'll directly modify.
  selectedFields = [
    { key: 'st_item_code', label: 'Item Code', selected: true },
    { key: 'st_bill_date', label: 'Bill Date', selected: true },
    { key: 'st_mfd_date', label: 'MFD Date', selected: true },
    { key: 'st_firm_id', label: 'Firm ID', selected: true },
    { key: 'st_brand_seller_name', label: 'Brand Seller Name', selected: true },
    { key: 'st_metal_type', label: 'Metal Type', selected: true },
    { key: 'st_metal_rate', label: 'Metal Rate', selected: true },
    { key: 'st_hsn_code', label: 'HSN Code', selected: true },
    { key: 'st_item_category', label: 'Item Category', selected: true },
    { key: 'st_item_name', label: 'Item Name', selected: true },
    { key: 'st_huid', label: 'HUID', selected: true },
    { key: 'st_item_model_no', label: 'Model Number', selected: true },
    { key: 'st_item_size', label: 'Item Size', selected: true },
    { key: 'st_item_length', label: 'Item Length', selected: true },
    { key: 'st_color', label: 'Color', selected: true },
    { key: 'st_barcode', label: 'Barcode', selected: true },
    { key: 'st_rfid_number', label: 'RFID Number', selected: true },
    { key: 'st_quantity', label: 'Quantity', selected: true },
    { key: 'st_gs_weight', label: 'Gross Weight', selected: true },
    { key: 'st_less_weight', label: 'Less Weight', selected: true },
    { key: 'st_pkt_weight', label: 'Packet Weight', selected: true },
    { key: 'st_net_weight', label: 'Net Weight', selected: true },
    { key: 'st_net_weight_type', label: 'Net Weight Type', selected: true },
    { key: 'st_purity', label: 'Purity', selected: true },
    { key: 'st_wastage', label: 'Wastage', selected: true },
    { key: 'st_cust_weight', label: 'Customer Weight', selected: true },
    { key: 'st_cust_wastage_weight', label: 'Customer Wastage Weight', selected: true },
    { key: 'st_final_purity', label: 'Final Purity', selected: true },
    { key: 'st_tag_weight', label: 'Tag Weight', selected: true },
    { key: 'st_counter_name', label: 'Counter Name', selected: true },
    { key: 'st_location', label: 'Location', selected: true },
    { key: 'st_fine_weight', label: 'Fine Weight', selected: true },
    { key: 'st_final_fine_weight', label: 'Final Fine Weight', selected: true },
    { key: 'st_making_charges', label: 'Making Charges', selected: true },
    { key: 'st_making_charges_type', label: 'Making Charges Type', selected: true },
    { key: 'st_valuation', label: 'Valuation', selected: true },
    { key: 'st_lab_charges', label: 'Lab Charges', selected: true },
    { key: 'st_lab_charges_type', label: 'Lab Charges Type', selected: true },
    { key: 'st_total_lab_charges', label: 'Total Lab Charges', selected: true },
    { key: 'st_hm_charges', label: 'HM Charges', selected: true },
    { key: 'st_hm_charges_type', label: 'HM Charges Type', selected: true },
    { key: 'st_total_hm_charges', label: 'Total HM Charges', selected: true },
    { key: 'st_other_charges', label: 'Other Charges', selected: true },
    { key: 'st_other_charges_type', label: 'Other Charges Type', selected: true },
    { key: 'st_total_other_charges', label: 'Total Other Charges', selected: true },
    { key: 'st_tax', label: 'Tax', selected: true },
    { key: 'st_total_tax', label: 'Total Tax', selected: true },
    { key: 'st_total_taxable_amt', label: 'Total Taxable Amount', selected: true },
    { key: 'st_bis_hallmark', label: 'BIS Hallmark', selected: true },
    { key: 'st_add_details', label: 'Additional Details', selected: true },
    { key: 'st_add_ecom', label: 'Additional ECOM', selected: true },
    { key: 'st_fix_mrp', label: 'Fixed MRP', selected: true },
    { key: 'st_final_valuation', label: 'Final Valuation', selected: true },
  ];

  // Store the initial default state for restoration
  private defaultSelectedFields = JSON.parse(JSON.stringify(this.selectedFields));


  constructor(
    private stockService: StockService,
    private notificationService: NotificationService,
  ) {
    this.visibleRowCount = this.itemsPerPage;
  }

  ngOnInit(): void {
    // Load saved column selections from localStorage
    const savedSelections = localStorage.getItem('retailColumnSelections');
    if (savedSelections) {
      const parsedSelections = JSON.parse(savedSelections);
      // Merge saved selections with default to handle new fields or deleted old ones
      this.selectedFields = this.defaultSelectedFields.map((defaultField: { key: any; }) => {
        const savedField = parsedSelections.find((f: any) => f.key === defaultField.key);
        return savedField ? { ...defaultField, selected: savedField.selected } : defaultField;
      });
    }
    this.getRetailStockList();
  }

  // --- Data Fetching & Deletion ---
  getRetailStockList(): void {
    this.stockService.getRetailStockOnly().subscribe({
      next: (response: any) => {
        this.retailStockList = response.data.reverse();
        this.filterTable(); // Apply initial filtering/sorting/pagination
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load retail stock. Please try again later.', 'Error');
        console.error('Error fetching retail stock list:', error);
      }
    });
  }

  deleteRetailStock(id: any): void {
    if (confirm('Are you sure you want to delete this retail stock entry? This action cannot be undone.')) {
      this.stockService.deleteStockEntry(id).subscribe({
        next: (response: any) => {
          this.notificationService.showSuccess('Retail stock entry deleted successfully!', 'Success');
          this.getRetailStockList(); // Refresh the list
        },
        error: (error: any) => {
          this.notificationService.showError('Failed to delete retail stock entry. Please try again.', 'Error');
          console.error('Error deleting retail stock entry:', error);
        }
      });
    }
  }

  // --- Table Filtering, Sorting & Pagination ---
  updateVisibleRows(): void {
    this.itemsPerPage = this.visibleRowCount;
    this.currentPage = 1; // Reset to first page when items per page changes
    this.filterTable();
  }

  filterTable(): void {
    let filtered = this.retailStockList.filter(item => {
      // 1. Column-specific search
      const matchesFieldFilters = Object.keys(this.searchValues).every(key => {
        const searchTerm = (this.searchValues[key] || '').trim().toLowerCase();
        if (!searchTerm) return true; // No search term for this specific column

        const fieldValue = (item[key] ?? '').toString().toLowerCase();
        return fieldValue.includes(searchTerm);
      });

      // 2. Global search
      const matchesGlobalSearch = this.globalSearchText
        ? Object.values(item).some(val =>
          (val ?? '').toString().toLowerCase().includes(this.globalSearchText.trim().toLowerCase())
        )
        : true;

      return matchesFieldFilters && matchesGlobalSearch;
    });

    // 3. Apply sorting
    if (this.sortKey) {
      filtered.sort((a, b) => {
        const valA = a[this.sortKey] ?? '';
        const valB = b[this.sortKey] ?? '';

        // Improved numeric comparison
        const isNumericA = !isNaN(parseFloat(valA)) && isFinite(valA);
        const isNumericB = !isNaN(parseFloat(valB)) && isFinite(valB);

        if (isNumericA && isNumericB) {
          return this.sortDirection === 'asc'
            ? parseFloat(valA) - parseFloat(valB)
            : parseFloat(valB) - parseFloat(valA);
        } else {
          // Fallback to string comparison
          return this.sortDirection === 'asc'
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
        }
      });
    }

    // 4. Calculate pagination
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    // Ensure currentPage is valid after filtering/sorting
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1; // If no results, reset to page 1
    }

    // 5. Slice data for the current page
    const start = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedStockList = filtered.slice(start, start + this.itemsPerPage);
  }

  sortBy(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc'; // Default to ascending when changing sort key
    }
    this.filterTable(); // Re-filter to apply new sort order
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.filterTable(); // Update table data for the new page
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filterTable();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.filterTable();
    }
  }

  // Getter to provide dynamic page numbers for pagination buttons
  get pageNumbers(): number[] {
    const pages: number[] = [];
    if (this.totalPages === 0) {
      return []; // No pages if no total results
    }

    const maxPagesToShow = 5; // How many page number buttons to show around current page
    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    // Adjust startPage if we don't have enough pages to fill 'maxPagesToShow' at the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  // --- Column Visibility ---
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  // This method only updates the 'selected' property of the field object.
  // It does NOT trigger table re-render or saving immediately.
  onFieldToggle(field: any): void {
    // NgModel handles the actual toggling of field.selected
    // No explicit action needed here other than what NgModel does
  }

  // This method applies the column selection changes to the table and saves them.
  applyColumnSelection(): void {
    localStorage.setItem('retailColumnSelections', JSON.stringify(this.selectedFields));
    this.filterTable(); // Re-render the table with new column visibility
    this.showDropdown = false; // Close the dropdown after applying
  }

  selectAllFields(): void {
    this.selectedFields.forEach((field) => (field.selected = true));
    // No direct filterTable() here; user clicks 'Apply'
  }

  deselectAllFields(): void {
    this.selectedFields.forEach((field) => (field.selected = false));
    // No direct filterTable() here; user clicks 'Apply'
  }

  // Restores columns to their default (all selected) and then applies the changes
  restoreColumnSelection(): void {
    localStorage.removeItem('retailColumnSelections'); // Clear saved preference
    // Create a NEW array from the default state to trigger change detection and proper updates
    this.selectedFields = JSON.parse(JSON.stringify(this.defaultSelectedFields));
    this.applyColumnSelection(); // Apply and save the restored state
  }

  // Getter for the template to easily loop through only selected fields for display
  get selectedFieldss(): any[] {
    return this.selectedFields.filter((field) => field.selected);
  }

  // --- Export & Print ---
  downloadPDF(): void {
    const doc = new jsPDF('l', 'mm', 'a4'); // 'l' for landscape

    const selectedFieldsForExport = this.selectedFields.filter((field) => field.selected);

    const headers = [
      { header: 'No.', dataKey: 'no' },
      ...selectedFieldsForExport.map((field) => ({
        header: field.label,
        dataKey: field.key,
      })),
    ];

    const data = this.paginatedStockList.map((item, index) => {
      const row: any = { no: (this.currentPage - 1) * this.itemsPerPage + index + 1 };
      selectedFieldsForExport.forEach((field) => {
        row[field.key] = item[field.key] ?? ''; // Use nullish coalescing for safety
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
        fillColor: [0, 123, 255], // Blue header
        textColor: 255, // White text
        halign: 'center',
        fontSize: 7,
      },
      bodyStyles: {
        valign: 'top',
      },
      startY: 10,
      margin: { top: 10, left: 5, right: 5 },
      theme: 'grid',
      tableWidth: 'wrap', // Auto-adjust table width
      horizontalPageBreak: true, // Allow horizontal page breaks for wide tables
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

    doc.save('retail-stock-list.pdf');
  }

  downloadExcel(): void {
    const selectedFieldsForExport = this.selectedFields.filter(field => field.selected);

    const data = this.paginatedStockList.map((item, index) => {
      const row: any = { 'No.': (this.currentPage - 1) * this.itemsPerPage + index + 1 };
      selectedFieldsForExport.forEach(field => {
        row[field.label] = item[field.key] ?? '';
      });
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Retail Stock List': worksheet },
      SheetNames: ['Retail Stock List']
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const fileName = 'retail-stock-list.xlsx';
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream'
    });
    FileSaver.saveAs(dataBlob, fileName);
  }

  downloadJSONAll(): void {
    const data = this.paginatedStockList || [];

    const jsonString = JSON.stringify(data, null, 2); // Pretty print JSON

    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = 'retail-stock-list.json';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href); // Clean up the URL object
  }

  downloadCSV(): void {
    const data = this.paginatedStockList || [];

    if (!data.length) return; // No data to export

    const selectedFieldsForExport = this.selectedFields.filter(f => f.selected);
    const headers = ['No.', ...selectedFieldsForExport.map(f => f.label)];
    const keys = selectedFieldsForExport.map(f => f.key);

    let csvContent = headers.join(',') + '\n';

    data.forEach((item, index) => {
      const row = [
        (this.currentPage - 1) * this.itemsPerPage + index + 1,
        ...keys.map(key => {
          const value = item[key];
          // Handle values with commas by enclosing in quotes
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value ?? ''; // Use nullish coalescing for safety
        }),
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = 'retail-stock-list.csv';

    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', fileName);
    link.click();

    URL.revokeObjectURL(link.href);
  }

  printTable(): void {
    let printContent = `<html><head>
      <title>Retail Stock List</title>
      <style>
        body { font-family: sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; font-size: 10px; margin-top: 20px; }
        th, td { border: 1px solid #ccc; padding: 5px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        h3 { text-align: center; margin-bottom: 15px; color: #333; }
      </style>
    </head><body>
      <h3>Available Retail Stock List</h3>
      <table>
        <thead>
          <tr>
            <th>No.</th>`;

    // Add visible column headers dynamically
    this.selectedFieldss.forEach(field => {
      printContent += `<th>${field.label}</th>`;
    });

    printContent += `</tr></thead><tbody>`;

    // Add data rows dynamically
    this.paginatedStockList.forEach((item, index) => {
      printContent += `<tr>
        <td>${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>`;

      this.selectedFieldss.forEach(field => {
        printContent += `<td>${item[field.key] ?? ''}</td>`;
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
}
