import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseStockCategoryListListComponent } from './purchase-stock-category-list-list.component';

describe('PurchaseStockCategoryListListComponent', () => {
  let component: PurchaseStockCategoryListListComponent;
  let fixture: ComponentFixture<PurchaseStockCategoryListListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseStockCategoryListListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseStockCategoryListListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
