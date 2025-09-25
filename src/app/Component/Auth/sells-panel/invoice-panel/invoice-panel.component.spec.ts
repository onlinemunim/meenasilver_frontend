import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicePanelComponent } from './invoice-panel.component';

describe('InvoicePanelComponent', () => {
  let component: InvoicePanelComponent;
  let fixture: ComponentFixture<InvoicePanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicePanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvoicePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
