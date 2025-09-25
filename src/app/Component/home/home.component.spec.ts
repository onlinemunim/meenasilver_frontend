import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
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
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HomeNavbarComponent,
        LeftNavbarComponent,
        RightNavbarComponent,
        TotalSalesComponent,
        TodoListComponent,
        BrandDetailsComponent,
        TodaysTransactionComponent,
        TopsellProductComponent,
        NewOnboardComponent,
        HomeUserComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
