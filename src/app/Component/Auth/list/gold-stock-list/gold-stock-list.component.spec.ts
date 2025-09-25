import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldStockListComponent } from './gold-stock-list.component';

describe('GoldStockListComponent', () => {
  let component: GoldStockListComponent;
  let fixture: ComponentFixture<GoldStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldStockListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
