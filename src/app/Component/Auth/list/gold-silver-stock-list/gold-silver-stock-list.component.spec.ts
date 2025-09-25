import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldSilverStockListComponent } from './gold-silver-stock-list.component';

describe('GoldSilverStockListComponent', () => {
  let component: GoldSilverStockListComponent;
  let fixture: ComponentFixture<GoldSilverStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoldSilverStockListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoldSilverStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
