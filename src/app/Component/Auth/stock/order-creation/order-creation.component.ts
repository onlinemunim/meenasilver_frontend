 // In your component class (design-product.component.ts)

 interface DesignProduct {
  id: number;
  product_code: string;
  product_name: string;
  image: string;
  metal_data?: MetalItem[];
  stone_data?: StoneItem[];
  packaging_data?: PackagingItem[];
  total_price: number;
  total_thread: number;
  image_url?: string;
  [key: string]: any;

  new_qty?: number;
  calculated_metal_price?: number;
  calculated_stone_price?: number;
}

interface MetalItem {
  code: string;
  artical_name: string;
  quantity: number;
  product_id?: number;
  per_piece_weight?: number;
  total_weight?: number;
  per_piece_price?: number;
}

interface StoneItem {
  code: string;
  stone_name: string;
  quantity: number;
  product_id?: number;
}

interface PackagingItem {
  product_code: string;
  material_name: string;
  quantity: number;
  product_id?: number;
}


import { DecimalPipe, NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { NotificationService } from '../../../../Services/notification.service';
import { MetalService } from '../../../../Services/metal.service';
import { PackagingService } from '../../../../Services/Product_Creation/packaging.service';
import { ProductService } from '../../../../Services/product.service';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { StockPriceService } from '../../../../Services/Product_Creation/stock-price.service';

interface DesignProduct {
  id: number;
  product_code: string;
  product_name: string;
  image: string;
  metal_data?: MetalItem[];
  stone_data?: StoneItem[];
  packaging_data?: PackagingItem[];
  total_price: number;
  total_thread: number;
  image_url?: string;
}

interface MetalItem {
  code: string;
  artical_name: string;
  quantity: number;
  product_id?: number;
}

interface StoneItem {
  code: string;
  stone_name: string;
  quantity: number;
  product_id?: number;
}

interface PackagingItem {
  product_code: string;
  material_name: string;
  quantity: number;
  product_id?: number;
}

@Component({
  selector: 'app-order-creation',
  standalone:true,
  imports: [NgIf, DecimalPipe, NgFor, NgSwitch, NgSwitchDefault, NgSwitchCase, FormsModule, RouterLink, ReactiveFormsModule],
  templateUrl: './order-creation.component.html',
  styleUrl: './order-creation.component.css',
})
export class OrderCreationComponent implements OnInit {
  totalPages: number = 0;
  searchValues: { [key: string]: string } = {};
  globalSearchText: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  sortKey: string = '';
  showDropdown: boolean = false;
  paginatedDesignProductList: DesignProduct[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  visibleRowCount: number = 10;
  designProductList: DesignProduct[] = [];
  purchasePrice: any;
  purchasePriceData:any;
  metalDataList: MetalItem[] = [];
  stoneDataList: StoneItem[] = [];
  packagingDataList: PackagingItem[] = [];
  selectedProductCode: string = '';

  imagePreviews: string[] = ['assets/image/add-image.png'];
  fileUploadError: string[] = ['', '', ''];

  selectedFields: {
    key: string;
    label: string;
    selected: boolean;
    isCustom?: boolean;
    input?: boolean;
    subFields?: { key: string; label: string }[];
  }[] = [
    { key: 'unique_code_sku', label: 'Product Code', selected: true, input: true },
    { key: 'product_name', label: 'Product Name', selected: true },
    { key: 'image', label: 'Image', selected: true, isCustom: true },
    { key: 'new_qty', label: 'Add Quantity', selected: true, isCustom: true, input:true },
    {
      key: 'metal_data',
      label: 'Metal Details',
      selected: true,
      isCustom: true,
      subFields: [
        { key: 'code', label: 'Code' },
        { key: 'artical_name', label: 'Name' },
        { key: 'quantity', label: 'Qty' },
      ],
    },
    {
      key: 'stone_data',
      label: 'Stone Details',
      selected: true,
      isCustom: true,
      subFields: [
        { key: 'code', label: 'Code' },
        { key: 'stone_name', label: 'Name' },
        { key: 'quantity', label: 'Qty' },
      ],
    },
    {
      key: 'packaging_data',
      label: 'Packaging Details',
      selected: true,
      isCustom: true,
      subFields: [
        { key: 'code', label: 'Code' },
        { key: 'package_type', label: 'Type' },
        { key: 'quantity', label: 'Qty' },
      ],
    },
    { key: 'total_price', label: 'Total Price', selected: true, isCustom: true },
    { key: 'total_thread', label: 'Total Thread', selected: true, isCustom: true },
    { key: 'assign_to', label: 'Assign To', selected: true, isCustom: true, input:true },
  ];
    purchasePriceList!: any[];
  latestPrice: any;

  constructor(
    private notificationService: NotificationService,
    private metalService: MetalService,
    private productService: ProductService,
    private packagingService: PackagingService,
    private stockGeneralService: StockGeneralService,
    private stockPriceService:StockPriceService
  ) {}

  ngOnInit(): void {
    const savedSelections = localStorage.getItem('ordercreationfields');
    if (savedSelections) {
      this.selectedFields = JSON.parse(savedSelections);
    }

    this.itemsPerPage = this.visibleRowCount;
    this.getDesignProductList();
  }

  selectedProduct: any = {
    unique_code_sku: '-',
    product_name: '-',
    product_image: '',
    product_image_2: '',
    product_image_3: '',
    product_image_4: '',
    product_image_5: '',
    metal_data: [],
    stone_data: [],
    packaging_data: [],
    total_price: '-',
    total_thread: '-',
    latest_price_info: {
      purchase_price: '-',
      thread_price: '-',
    }
  };

  getDesignProductList() {
    this.stockGeneralService.getGeneralProductCodeForProductDesign().subscribe({
      next: (response: any) => {
        const rawProducts = response?.data || [];

        this.designProductList = rawProducts.map((item: any) => ({
          id: item.id,
          unique_code_sku: item.unique_code_sku || 'N/A',
          product_name: item.product_name || 'N/A',
          product_image: item.product_image,
          product_image_2 : item.product_image_2,
          product_image_3 : item.product_image_3,
          product_image_4 : item.product_image_4,
          product_image_5 : item.product_image_5,

          // Mapping as per your table template
          metal_data: item.assembly_metal_part || [],
          stone_data: item.assembly_stone || [],
          packaging_data: item.packaging || [],

          // Extract latest price info (e.g. first price entry)
          latest_price_info: item.latest_product_price || {}
        })).reverse();

        this.totalPages = Math.ceil(this.designProductList.length / this.itemsPerPage);
        this.updatePaginatedList();

        console.log('Processed Design Product List:', this.designProductList);
        console.log('Total Pages:', response.data);
      },
      error: (error: any) => {
        this.notificationService.showError('Failed to load products.', 'Error');
        console.error('Error fetching product list:', error);
      }
    });
  }

  get firstValidItem() {
    return this.paginatedDesignProductList.find(
      item =>
        (item?.metal_data?.length ||
          item?.stone_data?.length ||
          item?.packaging_data?.length) &&
        item?.['latest_price_info']?.['purchase_price']
    );
  }

  onQuantityChange(item: DesignProduct): void {
    const newQty = item.new_qty || 0;

    // Metal price = per_piece_weight * quantity * new_qty
    let metalPrice = 0;
    if (item.metal_data) {
      metalPrice = item.metal_data.reduce((sum, metal) => {
        const perWeight = metal.per_piece_weight || 0;
        const qty = metal.quantity || 0;
        return sum + (perWeight * qty * newQty);
      }, 0);
    }

    // Stone price = stone.quantity * new_qty
    let stonePrice = 0;
    if (item.stone_data) {
      stonePrice = item.stone_data.reduce((sum, stone) => {
        const qty = stone.quantity || 0;
        return sum + (qty * newQty);
      }, 0);
    }

    item.calculated_metal_price = metalPrice;
    item.calculated_stone_price = stonePrice;
  }

  filterByProductCode(): void {
    if (this.selectedProductCode) {
      const filtered = this.designProductList.filter(
        (item) => item['unique_code_sku'] === this.selectedProductCode
      );
      this.paginatedDesignProductList = filtered;
      this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
      this.currentPage = 1;

      this.selectedProduct = filtered.length ? filtered[0] : null;
    } else {
      this.selectedProduct = null;
      this.updatePaginatedList();
    }
  }

  filterTable() {
    let filtered = this.designProductList.filter((item) => {
      const matchesFieldFilters = this.selectedFields.every((field) => {
        const searchTerm = (this.searchValues[field.key] || '')
          .trim()
          .toLowerCase();
        if (!searchTerm) return true;

        if (field.isCustom && (field.key === 'metal_data' || field.key === 'stone_data' || field.key === 'packaging_data')) {
          return item[field.key]?.some((subItem: any) =>
            Object.values(subItem).some(val =>
              (val ?? '').toString().toLowerCase().includes(searchTerm)
            )
          ) || false;
        } else {
          const fieldValue = (item[field.key] ?? '').toString().toLowerCase();
          return fieldValue.includes(searchTerm);
        }
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
    this.paginatedDesignProductList = filtered.slice(
      start,
      start + this.itemsPerPage
    );
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
  }

  updatePaginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedDesignProductList = this.designProductList.slice(start, end);
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
    const pages: number[] = [];
    const maxPagesToShow = 5; // Adjust as needed
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push(0); // Represents '...'
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        pages.push(0); // Represents '...'
      }
      pages.push(this.totalPages);
    }
    return pages.filter(page => page !== 0); // Remove the '0' if it's the only page
  }

  updateVisibleRows() {
    this.itemsPerPage = this.visibleRowCount;
    this.currentPage = 1;
    this.filterTable();
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  onFieldToggle(field: any) {
    field.selected = !field.selected;
    this.saveSelectedFields();
    this.filterTable();
  }

  saveSelectedFields() {
    localStorage.setItem(
      'ordercreationfields',
      JSON.stringify(this.selectedFields)
    );
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
    localStorage.removeItem('designProductColumnSelections');
    this.selectedFields = [
      { key: 'unique_code_sku', label: 'Product Code', selected: true },
      { key: 'product_name', label: 'Product Name', selected: true },
      { key: 'image', label: 'Image', selected: true, isCustom: true },
      {
        key: 'metal_data',
        label: 'Metal Details',
        selected: true,
        isCustom: true,
        subFields: [
          { key: 'code', label: 'Code' },
          { key: 'artical_name', label: 'Name' },
          { key: 'quantity', label: 'Qty' },
        ],
      },
      {
        key: 'stone_data',
        label: 'Stone Details',
        selected: true,
        isCustom: true,
        subFields: [
          { key: 'code', label: 'Code' },
          { key: 'stone_name', label: 'Name' },
          { key: 'quantity', label: 'Qty' },
        ],
      },
      {
        key: 'packaging_data',
        label: 'Packaging Details',
        selected: true,
        isCustom: true,
        subFields: [
          { key: 'code', label: 'Code' },
          { key: 'package_type', label: 'Type' },
          { key: 'quantity', label: 'Qty' },
        ],
      },
      { key: 'total_price', label: 'Total Price', selected: true, isCustom: true },
      { key: 'total_thread', label: 'Thread Price', selected: true, isCustom: true },
    ];
    this.filterTable();
  }

  get selectedFieldss() {
    return this.selectedFields.filter((field) => field.selected);
  }

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

    const data = this.paginatedDesignProductList.map((item, index) => {
      const row: any = { no: index + 1 };
      selectedFields.forEach((field) => {
        if (field.isCustom) {
          if (field.key === 'image') {
            row[field.key] = 'Image available (see application)';
          } else if (field.key === 'metal_data' || field.key === 'stone_data' || field.key === 'packaging_data') {
            row[field.key] = JSON.stringify(item[field.key]);
          } else {
            row[field.key] = item[field.key] ?? '';
          }
        } else {
          row[field.key] = item[field.key] ?? '';
        }
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

    doc.save('design-product-list.pdf');
  }

  downloadExcel(): void {
    const selectedFields = this.selectedFields.filter(
      (field) => field.selected
    );

    const data = this.paginatedDesignProductList.map((item, index) => {
      const row: any = { 'No.': index + 1 };
      selectedFields.forEach((field) => {
        if (field.isCustom) {
          if (field.key === 'image') {
            row[field.label] = 'Image available';
          } else if (field.key === 'metal_data' || field.key === 'stone_data' || field.key === 'packaging_data') {
            row[field.label] = JSON.stringify(item[field.key]);
          } else {
            row[field.label] = item[field.key] ?? '';
          }
        } else {
          row[field.label] = item[field.key] ?? '';
        }
      });
      return row;
    });

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Design Product List': worksheet },
      SheetNames: ['Design Product List'],
    };

    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const fileName = 'design-product-list.xlsx';
    const dataBlob: Blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    FileSaver.saveAs(dataBlob, fileName);
  }

  downloadJSONAll(): void {
    const data = this.paginatedDesignProductList || [];
    const jsonString = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonString], { type: 'application/json' });
    const fileName = 'design-product-list.json';

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();

    URL.revokeObjectURL(link.href);
  }

  downloadCSV(): void {
    const data = this.paginatedDesignProductList || [];

    if (!data.length) return;

    const selectedFields = this.selectedFields?.filter((f) => f.selected) || [];
    const headers = ['No.', ...selectedFields.map((f) => f.label)];
    const keys = selectedFields.map((f) => f.key);

    let csvContent = headers.join(',') + '\n';

    data.forEach((item, index) => {
      const row = [
        index + 1,
        ...keys.map((key) => {
          let value = item[key];
          if (key === 'image') {
            value = 'Image available';
          } else if (key === 'metal_data' || key === 'stone_data' || key === 'packaging_data') {
            value = JSON.stringify(item[key]);
          }

          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value ?? '';
        }),
      ];
      csvContent += row.join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = 'design-product-list.csv';

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
      <h3>Design Product List</h3>
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

    this.paginatedDesignProductList.forEach((item, index) => {
      printContent += `<tr>
        <td>${(this.currentPage - 1) * this.itemsPerPage + index + 1}</td>`;

      this.selectedFields.forEach((field) => {
        if (field.selected) {
          if (field.key === 'image') {
            printContent += `<td><img src="${item.image}" alt="Design Product Image" style="width: 50px; height: 50px; object-fit: contain;"></td>`;
          } else if (field.key === 'metal_data') {
             let subTable = `<table style="width: 100%; border-collapse: collapse; font-size: 10px;"><thead><tr style="background-color: #e9e9e9;">
                               <th>Code</th><th>Name</th><th>Qty</th></tr></thead><tbody>`;
             item.metal_data?.forEach((metal: any) => {
               subTable += `<tr><td>${metal.code ?? '-'}</td><td>${metal.artical_name ?? '-'}</td><td>${metal.quantity ?? '-'}</td></tr>`;
             });
             subTable += `</tbody></table>`;
             printContent += `<td>${item.metal_data?.length ? subTable : 'N/A'}</td>`;
          } else if (field.key === 'stone_data') {
            let subTable = `<table style="width: 100%; border-collapse: collapse; font-size: 10px;"><thead><tr style="background-color: #e9e9e9;">
                              <th>Code</th><th>Name</th><th>Qty</th></tr></thead><tbody>`;
            item.stone_data?.forEach((stone: any) => {
              subTable += `<tr><td>${stone.code ?? '-'}</td><td>${stone.stone_name ?? '-'}</td><td>${stone.quantity ?? '-'}</td></tr>`;
            });
            subTable += `</tbody></table>`;
            printContent += `<td>${item.stone_data?.length ? subTable : 'N/A'}</td>`;
          } else if (field.key === 'packaging_data') {
            let subTable = `<table style="width: 100%; border-collapse: collapse; font-size: 10px;"><thead><tr style="background-color: #e9e9e9;">
                              <th>Material</th><th>Qty</th></tr></thead><tbody>`;
            item.packaging_data?.forEach((packaging: any) => {
              subTable += `<tr><td>${packaging.material_name ?? '-'}</td><td>${packaging.quantity}</td></tr>`;
            });
            subTable += `</tbody></table>`;
            printContent += `<td>${item.packaging_data?.length ? subTable : 'N/A'}</td>`;
          }
          else {
            printContent += `<td>${item[field.key] ?? ''}</td>`;
          }
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

  // openMetalDetails, openStoneDetails, and openPackagingDetails methods are removed
  // as the data is now directly embedded in the table.
  // Make sure to remove any calls to these methods in your HTML.

  private generateDummyPrice(): number {
    return parseFloat((Math.random() * 2000 + 100).toFixed(2));
  }

  private generateDummyThread(): number {
    return Math.floor(Math.random() * 50) + 1;
  }

  onImageSelected(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.fileUploadError[index] = 'File size should not exceed 2MB.';
        this.imagePreviews[index] = 'assets/image/add-image.png';
        return;
      }
      this.fileUploadError[index] = '';

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews[index] = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  deleteDesignProduct(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      customClass: {
        confirmButton: 'swal2-confirm-button',
        cancelButton: 'swal2-cancel-button'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.stockGeneralService.deleteProduct(id).subscribe(
          (response: any) => {
            this.notificationService.showSuccess('Product deleted successfully!', 'Success');
            this.getDesignProductList();
          },
          (error: any) => {
            this.notificationService.showError('Failed to delete product. Please try again.', 'Error');
            console.error('Error deleting product:', error);
          }
        );
      }
    });
  }
}
