import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StockOutListComponent } from './stock-out-list.component';
import { StockOutService } from '../../../../Services/Stock_Transactions/Stock_out/stock-out.service';
import { NotificationService } from '../../../../Services/notification.service';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('StockOutListComponent', () => {
  let component: StockOutListComponent;
  let fixture: ComponentFixture<StockOutListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        StockOutListComponent
      ],
      providers: [
        StockOutService,
        NotificationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockOutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
