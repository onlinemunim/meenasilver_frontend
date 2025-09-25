import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceB2bComponent } from './invoice-b2b.component';

describe('InvoiceB2bComponent', () => {
  let component: InvoiceB2bComponent;
  let fixture: ComponentFixture<InvoiceB2bComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceB2bComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoiceB2bComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
