import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { StaffHomeComponent } from './staff-home.component';

@Component({
  selector: 'app-product-sales-report',
  template: ''
})

class MockProductSalesReportComponent {}

describe('StaffHomeComponent', () => {
  let component: StaffHomeComponent;
  let fixture: ComponentFixture<StaffHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffHomeComponent, MockProductSalesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
