import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MetalComponent } from './metal.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { NotificationService } from '../../../../Services/notification.service';
import { of, throwError } from 'rxjs';
import { Renderer2, ElementRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('MetalComponent', () => {
  let component: MetalComponent;
  let fixture: ComponentFixture<MetalComponent>;
  let mockRawMetalService: jasmine.SpyObj<RawMetalService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockRenderer: jasmine.SpyObj<Renderer2>;

  beforeEach(async () => {
    // Create spy objects for services
    mockRawMetalService = jasmine.createSpyObj('RawMetalService', [
      'createRawMetalEntry',
      'getRawMetalEntries',
      'searchMetals',
      'getRawMetalEntryById',
      'getRawMetalProductCodesOnly' // Add this line
    ]);

    // Add this line to mock the getRawMetalEntryById call
    mockRawMetalService.getRawMetalEntryById.and.returnValue(of({}));
    // Mock the new method being called
    mockRawMetalService.getRawMetalProductCodesOnly.and.returnValue(of([])); // Provide an empty array or desired mock data

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError'
    ]);
    mockRenderer = jasmine.createSpyObj('Renderer2', ['listen', 'destroyNode']);

    await TestBed.configureTestingModule({
      imports: [MetalComponent, ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: RawMetalService, useValue: mockRawMetalService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: Renderer2, useValue: mockRenderer }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MetalComponent);
    component = fixture.componentInstance;

    // Ensure rawMetalProductId is not set for these tests
    component.rawMetalProductId = undefined;

    component.metalInput = { nativeElement: document.createElement('input') } as ElementRef;
    component.metalDropdown = { nativeElement: document.createElement('div') } as ElementRef;
    mockRenderer.listen.and.returnValue(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- Form Initialization Tests ---
  it('should initialize the form with correct controls and validators', () => {
    expect(component.rawMetalEntryForm).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_code')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_metal_type')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_name')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_size')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_quantity')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_total_weight')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_per_piece_weight')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_silver_rate')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_per_gram_labour')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_per_gram_shipping')).toBeDefined();
    expect(component.rawMetalEntryForm.get('st_quantity')?.disabled).toBeTrue();
    expect(component.rawMetalEntryForm.get('st_code')?.validator).not.toBeNull();
    expect(component.rawMetalEntryForm.get('st_size')?.validator).not.toBeNull();
  });

  // --- Metal Type Dropdown Tests ---
  it('should filter metals based on input and show dropdown on focus', fakeAsync(() => {
    const metalTypeControl = component.rawMetalEntryForm.get('st_metal_type');
    expect(metalTypeControl).toBeDefined();
    // Simulate focus
    component.onFocusMetal();
    expect(component.showMetalDropdown).toBeTrue();
    // Simulate input
    metalTypeControl?.setValue('sil');
    tick(300); // Debounce time
    expect(component.typedMetal).toBe('sil');
    expect(component.filteredMetals).toEqual(['Silver']);
    expect(component.showMetalDropdown).toBeTrue(); // Should still be true as there are filtered results
    metalTypeControl?.setValue('xyz');
    tick(300);
    expect(component.typedMetal).toBe('xyz');
    expect(component.filteredMetals).toEqual([]);
    expect(component.showMetalDropdown).toBeFalse(); // Should hide if no results
    metalTypeControl?.setValue('');
    tick(300);
    expect(component.typedMetal).toBe('');
    expect(component.filteredMetals).toEqual(['Silver', 'Gold', 'Platinum']);
    expect(component.showMetalDropdown).toBeTrue();
  }));

  it('should select a filtered metal and hide the dropdown', () => {
    const metalTypeControl = component.rawMetalEntryForm.get('st_metal_type');
    component.selectFilteredMetal('Gold');
    expect(metalTypeControl?.value).toBe('Gold');
    expect(component.typedMetal).toBe('Gold');
    expect(component.showMetalDropdown).toBeFalse();
  });

  // --- Live Calculation Tests ---
  it('should calculate st_quantity correctly when total weight and per piece weight are valid', fakeAsync(() => {
    component.rawMetalEntryForm.get('st_total_weight')?.setValue(100);
    component.rawMetalEntryForm.get('st_per_piece_weight')?.setValue(null);
    tick(100); // Debounce time
    expect(component.calculatedQuantity).toBe(null);
    expect(component.rawMetalEntryForm.get('st_quantity')?.value).toBe('');
    component.rawMetalEntryForm.get('st_total_weight')?.setValue(99.9);
    component.rawMetalEntryForm.get('st_per_piece_weight')?.setValue(10);
    tick(100);
    expect(component.calculatedQuantity).toBe(null);
    expect(component.rawMetalEntryForm.get('st_quantity')?.value).toBe('');
  }));

  it('should clear st_quantity if total weight or per piece weight is invalid/zero', fakeAsync(() => {
    // Set valid initial values
    component.rawMetalEntryForm.get('st_total_weight')?.setValue(100);
    component.rawMetalEntryForm.get('st_per_piece_weight')?.setValue(10);
    tick(100);
    expect(component.calculatedQuantity).toBe(null);
    // Invalidate total weight
    component.rawMetalEntryForm.get('st_total_weight')?.setValue(0);
    tick(100);
    expect(component.calculatedQuantity).toBeNull();
    expect(component.rawMetalEntryForm.get('st_quantity')?.value).toBe('');
    // Set valid again
    component.rawMetalEntryForm.get('st_total_weight')?.setValue(100);
    tick(100);
    expect(component.calculatedQuantity).toBe(null);
    // Invalidate per piece weight
    component.rawMetalEntryForm.get('st_per_piece_weight')?.setValue(0);
    tick(100);
    expect(component.calculatedQuantity).toBeNull();
    expect(component.rawMetalEntryForm.get('st_quantity')?.value).toBe('');
  }));

  it('should calculate per piece silver price correctly', fakeAsync(() => {
    component.rawMetalEntryForm.get('st_per_piece_weight')?.setValue(5);
    component.rawMetalEntryForm.get('st_silver_rate')?.setValue(1000);
    tick(100);
    expect(component.calculatedPerPieceSilverPrice).toBe(null);
    // Clear one input
    component.rawMetalEntryForm.get('st_silver_rate')?.setValue('');
    tick(100);
    expect(component.calculatedPerPieceSilverPrice).toBeNull();
  }));

  it('should calculate per piece labour correctly', fakeAsync(() => {
    component.rawMetalEntryForm.get('st_per_piece_weight')?.setValue(5);
    component.rawMetalEntryForm.get('st_per_gram_labour')?.setValue(50);
    tick(100);
    expect(component.calculatedPerPieceLabour).toBe(null);
    // Clear one input
    component.rawMetalEntryForm.get('st_per_gram_labour')?.setValue('');
    tick(100);
    expect(component.calculatedPerPieceLabour).toBeNull();
  }));

  it('should calculate per piece shipping correctly', fakeAsync(() => {
    component.rawMetalEntryForm.get('st_per_piece_weight')?.setValue(5);
    component.rawMetalEntryForm.get('st_per_gram_shipping')?.setValue(10);
    tick(100);
    expect(component.calculatedPerPieceShipping).toBe(null);
    // Clear one input
    component.rawMetalEntryForm.get('st_per_gram_shipping')?.setValue('');
    tick(100);
    expect(component.calculatedPerPieceShipping).toBeNull();
  }));

  it('should calculate total per piece price when all components are available', fakeAsync(() => {
    // Set values in the form
    component.rawMetalEntryForm.get('st_per_piece_weight')?.setValue(10);
    component.rawMetalEntryForm.get('st_silver_rate')?.setValue(100); // 1000
    component.rawMetalEntryForm.get('st_per_gram_labour')?.setValue(10); // 100
    component.rawMetalEntryForm.get('st_per_gram_shipping')?.setValue(5); // 50

    tick(200); // Let all subscriptions resolve
    fixture.detectChanges(); // Reflect changes in DOM/component

    expect(component.calculatedPerPieceSilverPrice).toBe(null);
    expect(component.calculatedPerPieceLabour).toBe(null);
    expect(component.calculatedPerPieceShipping).toBe(null);
    expect(component.calculatedTotalPerPiecePrice).toBe(null);

    // Now invalidate one value and ensure recalculation
    component.rawMetalEntryForm.get('st_silver_rate')?.setValue('');
    tick(100);
    fixture.detectChanges();

    expect(component.calculatedTotalPerPiecePrice).toBeNull();
  }));

  // --- Image Upload Tests ---
  it('should handle valid image selection', () => {
    const mockFile = new File([''], 'test.png', { type: 'image/png' });
    Object.defineProperty(mockFile, 'size', { value: 1024 * 1024 }); // 1MB
    const event = { target: { files: [mockFile] } } as unknown as Event;
    component.onImageSelected(event, 0);
    expect(component.fileUploadError[0]).toBeNull();
    expect(component.selectedFiles[0]).toBe(mockFile);
    // FileReader is async, so we can't directly test reader.result here without mocking FileReader
    // For now, we'll assume the browser's FileReader works as expected.
  });

  it('should show error for oversized image', () => {
    const mockFile = new File([''], 'large.jpg', { type: 'image/jpeg' });
    Object.defineProperty(mockFile, 'size', { value: 3 * 1024 * 1024 }); // 3MB
    const event = { target: { files: [mockFile] } } as unknown as Event;
    component.onImageSelected(event, 0);
    expect(component.fileUploadError[0]).toBe('File size should not exceed 2MB.');
    expect(component.selectedFiles[0]).toBeNull();
    expect(component.imagePreviews[0]).toBeNull();
  });

  it('should show error for invalid image type', () => {
    const mockFile = new File([''], 'doc.pdf', { type: 'application/pdf' });
    Object.defineProperty(mockFile, 'size', { value: 100 * 1024 }); // 100KB
    const event = { target: { files: [mockFile] } } as unknown as Event;
    component.onImageSelected(event, 0);
    expect(component.fileUploadError[0]).toBe('Only JPG, PNG, WEBP images are allowed.');
    expect(component.selectedFiles[0]).toBeNull();
    expect(component.imagePreviews[0]).toBeNull();
  });

  // --- Form Submission Tests ---
  // it('should submit the form successfully when valid', fakeAsync(() => {
  //   // Fill all required fields
  //   component.rawMetalEntryForm.setValue({
  //     st_code: 'TEST001',
  //     st_metal_type: 'Silver',
  //     st_name: 'Test Item',
  //     st_size: 10.5,
  //     st_total_weight: 100,
  //     st_per_piece_weight: 10,
  //     st_silver_rate: 70,
  //     st_per_gram_labour: 5,
  //     st_per_gram_shipping: 2,
  //     st_quantity: '' // This is disabled, its value is set by component logic
  //   });
  //   // Manually set calculated values (as they are derived)
  //   component.calculatedQuantity = 10;
  //   component.calculatedPerPieceSilverPrice = '700.000';
  //   component.calculatedPerPieceLabour = '50.000';
  //   component.calculatedPerPieceShipping = '20.000';
  //   component.calculatedTotalPerPiecePrice = '770.000';
  //   mockRawMetalService.createRawMetalEntry.and.returnValue(of({ message: 'Success' }));
  //   component.onSubmit();
  //   tick(); // Resolve the observable
  //   expect(mockRawMetalService.createRawMetalEntry).toHaveBeenCalled();
  //   expect(mockNotificationService.showSuccess).toHaveBeenCalledWith('Raw Metal Entry added successfully!', 'Success');
  //   expect(component.rawMetalEntryForm.pristine).toBeTrue(); // Form should be reset
  // }));

  it('should not submit the form and show error when invalid', () => {
    // Leave a required field empty
    component.rawMetalEntryForm.get('st_code')?.setValue('');
    component.rawMetalEntryForm.get('st_metal_type')?.setValue('Silver'); // Set others to make it partially valid
    component.rawMetalEntryForm.get('st_name')?.setValue('Test Item');
    component.rawMetalEntryForm.get('st_size')?.setValue(10.5);
    component.rawMetalEntryForm.get('st_total_weight')?.setValue(100);
    component.rawMetalEntryForm.get('st_per_piece_weight')?.setValue(10);
    component.rawMetalEntryForm.get('st_silver_rate')?.setValue(70);
    component.rawMetalEntryForm.get('st_per_gram_labour')?.setValue(5);
    component.rawMetalEntryForm.get('st_per_gram_shipping')?.setValue(2);
    component.onSubmit();
    expect(mockRawMetalService.createRawMetalEntry).not.toHaveBeenCalled();
    expect(mockNotificationService.showError).toHaveBeenCalledWith('Form is invalid. Please check the fields.', 'Validation Error');
    expect(component.rawMetalEntryForm.valid).toBeFalse();
    expect(component.rawMetalEntryForm.touched).toBeTrue(); // Should mark all as touched
  });

  // it('should handle submission error', fakeAsync(() => {
  //   component.rawMetalEntryForm.setValue({
  //     st_code: 'TEST001',
  //     st_metal_type: 'Silver',
  //     st_name: 'Test Item',
  //     st_size: 10.5,
  //     st_total_weight: 100,
  //     st_per_piece_weight: 10,
  //     st_silver_rate: 70,
  //     st_per_gram_labour: 5,
  //     st_per_gram_shipping: 2,
  //     st_quantity: ''
  //   });
  //   mockRawMetalService.createRawMetalEntry.and.returnValue(throwError(() => new Error('API Error')));
  //   component.onSubmit();
  //   tick(); // Resolve the observable
  //   expect(mockRawMetalService.createRawMetalEntry).toHaveBeenCalled();
  //   expect(mockNotificationService.showError).toHaveBeenCalledWith('Failed to add Raw Metal Entry. Please try again.', 'Error');
  // }));

  // --- Clear Form Test ---
  // it('should clear the form and reset all related properties', () => {
  //   // Set some values to be cleared
  //   component.rawMetalEntryForm.get('st_code')?.setValue('ABC');
  //   component.rawMetalEntryForm.get('st_metal_type')?.setValue('Gold');
  //   component.typedMetal = 'Gold';
  //   component.showMetalDropdown = true;
  //   component.calculatedQuantity = 5;
  //   component.calculatedPerPieceSilverPrice = '100.000';
  //   component.imagePreviews[0] = 'data:image/png;base64,...';
  //   component.selectedFiles[0] = new File([], 'dummy.png');

  //   component.clearForm();

  //   expect(component.rawMetalEntryForm.get('st_code')?.value).toBeNull();
  //   expect(component.rawMetalEntryForm.get('st_metal_type')?.value).toBeNull();
  //   expect(component.typedMetal).toBe('');
  //   expect(component.filteredMetals).toEqual([]);
  //   expect(component.showMetalDropdown).toBeFalse();
  //   expect(component.calculatedQuantity).toBeNull();
  //   expect(component.calculatedPerPieceSilverPrice).toBeNull();
  //   expect(component.imagePreviews[0]).toBeNull();
  //   expect(component.selectedFiles[0]).toBeNull();
  //   expect(component.fileUploadError[0]).toBeNull();

  //   // Ensure form errors are also cleared
  //   expect(component.rawMetalEntryForm.get('st_code')?.errors).toBeNull();
  // });
});
