import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldOutStockListComponent } from './sold-out-stock-list.component';

describe('SoldOutStockListComponent', () => {
  let component: SoldOutStockListComponent;
  let fixture: ComponentFixture<SoldOutStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoldOutStockListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoldOutStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
