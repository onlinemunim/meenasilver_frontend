import { Component } from '@angular/core';
import { SalesTargetComponent } from "../sales-target/sales-target.component";
import { TopDetailsComponent } from "../top-details/top-details.component";
import { StockOverviewComponent } from "../stock-overview/stock-overview.component";
import { EmployeeDetailsComponent } from "../employee-details/employee-details.component";
import { PendingPaymentComponent } from "../pending-payment/pending-payment.component";
import { ProductSalesReportComponent } from "../product-sales-report/product-sales-report.component";
import { StarEmployeeComponent } from "../star-employee/star-employee.component";

@Component({
  selector: 'app-staff-home',
  standalone: true,
  imports: [SalesTargetComponent, TopDetailsComponent, StockOverviewComponent, EmployeeDetailsComponent, PendingPaymentComponent, ProductSalesReportComponent, StarEmployeeComponent],
  templateUrl: './staff-home.component.html',
  styleUrl: './staff-home.component.css'
})
export class StaffHomeComponent {

}
