import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawStoneStockListComponent } from './raw-stone-stock-list.component';

describe('RawStoneStockListComponent', () => {
  let component: RawStoneStockListComponent;
  let fixture: ComponentFixture<RawStoneStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawStoneStockListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawStoneStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
