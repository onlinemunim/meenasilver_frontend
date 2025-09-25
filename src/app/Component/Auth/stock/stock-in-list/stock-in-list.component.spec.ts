import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockInListComponent } from './stock-in-list.component';
import { StockInService } from '../../../../Services/Stock_Transactions/Stock_in/stock-in.service';
import { NotificationService } from '../../../../Services/notification.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('StockInListComponent', () => {
  let component: StockInListComponent;
  let fixture: ComponentFixture<StockInListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        RouterTestingModule,
        StockInListComponent
      ],
      providers: [
        StockInService,
        NotificationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
