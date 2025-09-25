import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilverStockListComponent } from './silver-stock-list.component';

describe('SilverStockListComponent', () => {
  let component: SilverStockListComponent;
  let fixture: ComponentFixture<SilverStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SilverStockListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SilverStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
