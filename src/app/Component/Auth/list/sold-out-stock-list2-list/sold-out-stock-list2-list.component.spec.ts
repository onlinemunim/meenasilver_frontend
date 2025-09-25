import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldOutStockList2ListComponent } from './sold-out-stock-list2-list.component';

describe('SoldOutStockList2ListComponent', () => {
  let component: SoldOutStockList2ListComponent;
  let fixture: ComponentFixture<SoldOutStockList2ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoldOutStockList2ListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldOutStockList2ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
