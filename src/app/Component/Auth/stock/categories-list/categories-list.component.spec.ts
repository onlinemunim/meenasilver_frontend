import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CategoriesListComponent } from './categories-list.component';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';

describe('CategoriesListComponent', () => {
  let component: CategoriesListComponent;
  let fixture: ComponentFixture<CategoriesListComponent>;
  let mockStockGeneralService: jasmine.SpyObj<StockGeneralService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('StockGeneralService', ['getCategories']);

    await TestBed.configureTestingModule({
      imports: [
        CategoriesListComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        FormsModule,
        RouterTestingModule
      ],
      providers: [
        { provide: StockGeneralService, useValue: spy }
      ]
    }).compileComponents();

    mockStockGeneralService = TestBed.inject(StockGeneralService) as jasmine.SpyObj<StockGeneralService>;
    mockStockGeneralService.getCategories.and.returnValue(
      of({ data: [{ id: 1, name: 'Category A' }, { id: 2, name: 'Category B' }] })
    );

    fixture = TestBed.createComponent(CategoriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit runs here
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCategories and set categoriesData', () => {
    expect(mockStockGeneralService.getCategories).toHaveBeenCalled();
    expect(component.categoriesData.length).toBe(2);
    expect(component.categoriesData[0].name).toBe('Category A');
  });
});
