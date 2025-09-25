import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailStockListListComponent } from './retail-stock-list-list.component';

describe('RetailStockListListComponent', () => {
  let component: RetailStockListListComponent;
  let fixture: ComponentFixture<RetailStockListListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RetailStockListListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailStockListListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
