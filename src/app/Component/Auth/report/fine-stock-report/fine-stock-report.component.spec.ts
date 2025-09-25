import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineStockReportComponent } from './fine-stock-report.component';

describe('FineStockReportComponent', () => {
  let component: FineStockReportComponent;
  let fixture: ComponentFixture<FineStockReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FineStockReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineStockReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
