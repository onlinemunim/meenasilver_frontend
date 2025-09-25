import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackageFilterComponent } from './package-filter.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterTestingModule } from '@angular/router/testing';  // To mock routing during testing

describe('PackageFilterComponent', () => {
  let component: PackageFilterComponent;
  let fixture: ComponentFixture<PackageFilterComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule,
        RouterTestingModule,
        PackageFilterComponent
      ],
      providers: [FormBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageFilterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form correctly', () => {
    expect(component.packageFilterForm).toBeDefined();
    expect(component.packageFilterForm.controls['name']).toBeDefined();
    expect(component.packageFilterForm.controls['status']).toBeDefined();
  });

  it('should submit the form with the correct query parameters', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.packageFilterForm.setValue({ name: 'Test', status: 'Active' });

    component.onSubmit();

    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: { name: 'Test', status: 'Active' },
      queryParamsHandling: 'merge'
    });
  });

  it('should reset the form and navigate with empty query parameters', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.packageFilterForm.setValue({ name: 'Test', status: 'Active' });

    // Calling reset
    component.onReset();

    expect(component.packageFilterForm.value).toEqual({ name: '', status: '' });
    expect(navigateSpy).toHaveBeenCalledWith([], {
      queryParams: { name: '', status: '' },
      queryParamsHandling: 'merge'
    });
  });

});
