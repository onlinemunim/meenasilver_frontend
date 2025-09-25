import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { StockStoneComponent } from '../../stock/stock-stone/stock-stone.component';

describe('RawStoneListComponent', () => {
  let component: StockStoneComponent;
  let fixture: ComponentFixture<StockStoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        StockStoneComponent,     // Standalone component
        HttpClientTestingModule,   // Mocks HttpClient
        ToastrModule.forRoot()     // <-- Fixes the ToastConfig injection error
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            queryParams: of({}),
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null)
              },
              data: {}
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockStoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
