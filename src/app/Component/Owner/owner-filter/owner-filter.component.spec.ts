import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OwnerFilterComponent } from './owner-filter.component';
import { Router } from '@angular/router';

describe('OwnerFilterComponent', () => {
  let component: OwnerFilterComponent;
  let fixture: ComponentFixture<OwnerFilterComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwnerFilterComponent],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerFilterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form with default values', () => {
    // Act
    component.initForm();

    const fields = [
      'id',
      'firstname',
      'lastname',
      'dateofbirth',
      'sexvalue',
      'mobilenumber',
      'mailid',
      'education',
    ];
    // Assert
    expect(component.ownerFilterForm).toBeDefined();
    expect(component.ownerFilterForm instanceof FormGroup).toBeTrue();

    // Check form controls
    fields.forEach((field) => {
      expect(component.ownerFilterForm.controls[field].value).toBe('');
    });
  });

  it('should initialize the form on ngOnInit', () => {
    spyOn(component, 'initForm');
    component.ngOnInit();
    expect(component.initForm).toHaveBeenCalled();
  });

  it('should call initForm on ngOnInit', () => {
    // Spy on initForm method
    spyOn(component, 'initForm');

    // Act
    component.ngOnInit();

    // Assert
    expect(component.initForm).toHaveBeenCalled();
  });

  it('should navigate with form values on submit', () => {
    // Arrange: Set form values
    component.ownerFilterForm.setValue({
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      dateofbirth: '1990-01-01',
      sexvalue: 'Male',
      mobilenumber: '1234567890',
      mailid: 'john@example.com',
      education: 'Bachelor',
    });

    // Act: Call onSubmit
    component.onSubmit();

    // Assert: Verify navigation with expected query params
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        dateofbirth: '1990-01-01',
        sexvalue: 'Male',
        mobilenumber: '1234567890',
        mailid: 'john@example.com',
        education: 'Bachelor',
      },
      queryParamsHandling: 'merge',
    });
  });

  it('should reset the form and navigate with empty values on reset', () => {
    // Arrange: Set form values before reset
    component.ownerFilterForm.setValue({
      id: 1,
      firstname: 'John',
      lastname: 'Doe',
      dateofbirth: '1990-01-01',
      sexvalue: 'Male',
      mobilenumber: '1234567890',
      mailid: 'john@example.com',
      education: 'Bachelor',
    });

    // Spy on form reset method
    spyOn(component.ownerFilterForm, 'reset').and.callThrough();

    // Act: Call onReset
    component.onReset();

    // Assert: Check if the form reset was called
    expect(component.ownerFilterForm.reset).toHaveBeenCalled();

    // Assert: Verify navigation with empty query params
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        id: null,
        firstname: null,
        lastname: null,
        dateofbirth: null,
        sexvalue: null,
        mobilenumber: null,
        mailid: null,
        education: null,
      },
      queryParamsHandling: 'merge',
    });
  });
});
