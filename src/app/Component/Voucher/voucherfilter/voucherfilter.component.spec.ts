import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { VoucherfilterComponent } from './voucherfilter.component';

describe('VoucherfilterComponent', () => {
  let component: VoucherfilterComponent;
  let fixture: ComponentFixture<VoucherfilterComponent>;
  let mockRouter: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoucherfilterComponent,MatSelectModule,MatFormFieldModule,ReactiveFormsModule,],
      providers: [FormBuilder],
    }) .compileComponents();

    fixture = TestBed.createComponent(VoucherfilterComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form on component initialization', () => {
    expect(component.voucherFilterForm).toBeDefined();
    expect(component.voucherFilterForm.controls['CreatorId']).toBeDefined();
    expect(component.voucherFilterForm.controls['name']).toBeDefined();
  });

  it('should navigate with query parameters on submit', () => {
    spyOn(mockRouter, 'navigate');
    component.voucherFilterForm.setValue({
      CreatorId: '1',
      name: 'John Doe',
    });
    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith([], {
      queryParams: { CreatorId: '1',name: 'John Doe' },
      queryParamsHandling: 'merge',
    });
});
it('should reset the form and query parameters on reset', () => {
  spyOn(mockRouter, 'navigate');
  component.voucherFilterForm.setValue({
    CreatorId: '1',
    name: 'John Doe',
  });
  component.onReset();
  expect(component.voucherFilterForm.value).toEqual({
    CreatorId: null,
    name: null,
  });
  expect(mockRouter.navigate).toHaveBeenCalledWith([], {
    queryParams: { CreatorId: null, name: null },
    queryParamsHandling: 'merge',
  });
});
});
