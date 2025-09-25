import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellCustomerComponent } from './sell-customer.component';

describe('SellCustomerComponent', () => {
  let component: SellCustomerComponent;
  let fixture: ComponentFixture<SellCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellCustomerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
