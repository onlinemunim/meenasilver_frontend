import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateListInvoiceComponent } from './rate-list-invoice.component';

describe('RateListInvoiceComponent', () => {
  let component: RateListInvoiceComponent;
  let fixture: ComponentFixture<RateListInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateListInvoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateListInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
