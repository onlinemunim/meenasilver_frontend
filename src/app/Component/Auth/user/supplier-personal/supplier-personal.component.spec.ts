import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierPersonalComponent } from './supplier-personal.component';

describe('SupplierPersonalComponent', () => {
  let component: SupplierPersonalComponent;
  let fixture: ComponentFixture<SupplierPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
