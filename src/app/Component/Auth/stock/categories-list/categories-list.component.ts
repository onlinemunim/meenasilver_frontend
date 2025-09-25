import { Component, OnInit } from '@angular/core';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { HttpParams } from '@angular/common/http';
import { NgFor } from '@angular/common';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categories-list',
  imports: [NgFor,FormsModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css'
})
export class CategoriesListComponent implements OnInit{
  categoriesData: any;
  paginatedStockList: any[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  stockGeneralList: any;

  constructor(private stockGeneralServiece:StockGeneralService){}

  router = inject(Router)

  ngOnInit(): void {
    this.getAllCategories();
  }

  // for list
  listTypes: string[] = ['General', 'categories', 'List 3'];
  selectedListType: string = '';

  showRelatedList() {
    if (this.selectedListType === 'General') {
      this.router.navigate(['general-list']);
    }else if (this.selectedListType === 'categories') {
      this.router.navigate(['categories-list']);
    }
  }


  getAllCategories(){
    const params = new HttpParams();
    this.stockGeneralServiece.getCategories(params).subscribe((response:any)=>{
      this.categoriesData = response.data
    })
  }

  updatePaginatedList() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedStockList = this.stockGeneralList.slice(start, end);
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
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }
}
