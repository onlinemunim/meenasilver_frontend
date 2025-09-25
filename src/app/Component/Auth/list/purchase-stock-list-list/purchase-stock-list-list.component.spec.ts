import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseStockListListComponent } from './purchase-stock-list-list.component';

describe('PurchaseStockListListComponent', () => {
  let component: PurchaseStockListListComponent;
  let fixture: ComponentFixture<PurchaseStockListListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseStockListListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseStockListListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
