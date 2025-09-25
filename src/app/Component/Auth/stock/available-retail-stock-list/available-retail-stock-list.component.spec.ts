import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AvailableRetailStockListComponent } from './available-retail-stock-list.component';

describe('AvailableRetailStockListComponent', () => {
  let component: AvailableRetailStockListComponent;
  let fixture: ComponentFixture<AvailableRetailStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        AvailableRetailStockListComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => 'mock-id' }),
            queryParamMap: of({ get: () => null }),
            snapshot: {
              paramMap: {
                get: () => 'mock-id'
              },
              queryParamMap: {
                get: () => null
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AvailableRetailStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
