import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllRawMetalStockListComponent } from './all-raw-metal-stock-list.component';

describe('AllRawMetalStockListComponent', () => {
  let component: AllRawMetalStockListComponent;
  let fixture: ComponentFixture<AllRawMetalStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllRawMetalStockListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllRawMetalStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
