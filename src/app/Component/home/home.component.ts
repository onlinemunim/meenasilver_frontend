import { Component } from '@angular/core';
import { HomeNavbarComponent } from "../Core/home-navbar/home-navbar.component";
import { LeftNavbarComponent } from "../Core/left-navbar/left-navbar.component";
import { RightNavbarComponent } from "../Core/right-navbar/right-navbar.component";
import { TotalSalesComponent } from "../Core/total-sales/total-sales.component";
import { TodoListComponent } from "../Core/todo-list/todo-list.component";
import { BrandDetailsComponent } from "../Core/brand-details/brand-details.component";
import { TodaysTransactionComponent } from "../Core/todays-transaction/todays-transaction.component";
import { TopsellProductComponent } from "../Core/topsell-product/topsell-product.component";
import { NewOnboardComponent } from "../Core/new-onboard/new-onboard.component";
import { HomeUserComponent } from "../Core/home-user/home-user.component";

@Component({
  selector: 'app-home',
  imports: [HomeNavbarComponent, LeftNavbarComponent, RightNavbarComponent, TotalSalesComponent, TodoListComponent, BrandDetailsComponent, TodaysTransactionComponent, TopsellProductComponent, NewOnboardComponent, HomeUserComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}

