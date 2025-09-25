import { StoneComponent } from './stone.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { NotificationService } from '../../../../Services/notification.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CustomSelectComponent } from '../../../Core/custom-select/custom-select.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router'; // Import ActivatedRoute

describe('StoneComponent', () => {
  let component: StoneComponent;
  let fixture: ComponentFixture<StoneComponent>;
  let mockRawMetalService: jasmine.SpyObj<RawMetalService>;
  let mockNotificationService: jasmine.SpyObj<NotificationService>;
  let mockFirmSelectionService: jasmine.SpyObj<FirmSelectionService>;

  // Create a more robust mock ActivatedRoute
  const mockActivatedRoute = {
    snapshot: {
      // Added snapshot property
      params: {},
      queryParams: {},
      data: {},
    },
    params: of({}),
    queryParams: of({}),
  };

  beforeEach(async () => {
    mockRawMetalService = jasmine.createSpyObj('RawMetalService', [
      'createRawMetalEntry',
      'getRawMetalEntryById',
      'getRawStoneProductCodesOnly', // <--- Add this line
    ]);
    mockRawMetalService.getRawMetalEntryById.and.returnValue(of({}));
    mockRawMetalService.getRawStoneProductCodesOnly.and.returnValue(of([])); // <--- Add this line with a mock return value

    mockNotificationService = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
    ]);
    mockFirmSelectionService = jasmine.createSpyObj(
      'FirmSelectionService',
      [],
      {
        selectedFirmName$: of({ id: 1, name: 'Test Firm' }),
      }
    );

    await TestBed.configureTestingModule({
      imports: [
        StoneComponent,
        ReactiveFormsModule,
        CommonModule,
        CustomSelectComponent,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        { provide: RawMetalService, useValue: mockRawMetalService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: FirmSelectionService, useValue: mockFirmSelectionService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }, // Provide the mock ActivatedRoute here
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // This calls ngOnInit where getRawStoneProductCodesOnly is likely being called
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should initialize the form with required fields and currentFirmId', fakeAsync(() => {
  //   expect(component.stoneEntryForm).toBeDefined();
  //   expect(component.stoneEntryForm.get('st_category')).toBeDefined();
  //   expect(component.stoneEntryForm.get('st_code')).toBeDefined();
  //   expect(component.stoneEntryForm.get('st_name')).toBeDefined();
  //   expect(component.stoneEntryForm.get('st_size')).toBeDefined();
  //   expect(component.stoneEntryForm.get('st_color')).toBeDefined();
  //   expect(component.stoneEntryForm.get('st_type')).toBeDefined();
  //   expect(component.stoneEntryForm.get('st_firm_id')?.value).toBe(1); // Check firm ID
  //   expect(
  //     component.stoneEntryForm.get('st_quantity')?.disabled
  //   ).toBeUndefined();
  //   expect(
  //     component.stoneEntryForm.get('st_per_stone_price')?.disabled
  //   ).toBeTrue();

  //   // Ensure initial state has no specific type selected, so all conditional fields are disabled
  //   expect(component.selectedDiamond).toBe('');
  //   expect(
  //     component.stoneEntryForm.get('st_per_mala_price')?.disabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_each_stone_weight')?.disabled
  //   ).toBeTrue();
  // }));

  // it('should update form validators and enable/disable fields when diamond type changes to By Mala', fakeAsync(() => {
  //   component.onDiamondSelectionChange('By Mala');
  //   tick(100); // Debounce time
  //   fixture.detectChanges();

  //   expect(
  //     component.stoneEntryForm.get('st_per_mala_price')?.enabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_stone_in_each_mala')?.enabled
  //   ).toBeTrue();
  //   expect(component.stoneEntryForm.get('st_total_mala')?.enabled).toBeTrue();

  //   expect(component.stoneEntryForm.get('st_quantity')?.disabled).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_per_stone_price')?.disabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_each_stone_weight')?.disabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_total_stone_weight')?.disabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_per_gram_price')?.disabled
  //   ).toBeTrue();

  //   // Check validators for By Mala fields
  //   expect(
  //     component.stoneEntryForm
  //       .get('st_per_mala_price')
  //       ?.hasValidator(Validators.required)
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm
  //       .get('st_stone_in_each_mala')
  //       ?.hasValidator(Validators.required)
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm
  //       .get('st_total_mala')
  //       ?.hasValidator(Validators.required)
  //   ).toBeTrue();
  // }));

  // it('should update form validators and enable/disable fields when diamond type changes to By Stone', fakeAsync(() => {
  //   component.onDiamondSelectionChange('By Stone');
  //   tick(100);
  //   fixture.detectChanges();

  //   expect(component.stoneEntryForm.get('st_quantity')?.enabled).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_per_stone_price')?.enabled
  //   ).toBeTrue();

  //   expect(
  //     component.stoneEntryForm.get('st_per_mala_price')?.disabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_stone_in_each_mala')?.disabled
  //   ).toBeTrue();
  //   expect(component.stoneEntryForm.get('st_total_mala')?.disabled).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_each_stone_weight')?.disabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_total_stone_weight')?.disabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_per_gram_price')?.disabled
  //   ).toBeTrue();

  //   // Check validators for By Stone fields
  //   expect(
  //     component.stoneEntryForm
  //       .get('st_quantity')
  //       ?.hasValidator(Validators.required)
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm
  //       .get('st_per_stone_price')
  //       ?.hasValidator(Validators.required)
  //   ).toBeTrue();
  // }));

  // it('should update form validators and enable/disable fields when diamond type changes to By Gram', fakeAsync(() => {
  //   component.onDiamondSelectionChange('By Gram');
  //   tick(100);
  //   fixture.detectChanges();

  //   expect(
  //     component.stoneEntryForm.get('st_each_stone_weight')?.enabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_total_stone_weight')?.enabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_per_gram_price')?.enabled
  //   ).toBeTrue();

  //   expect(component.stoneEntryForm.get('st_quantity')?.disabled).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_per_stone_price')?.disabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_per_mala_price')?.disabled
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm.get('st_stone_in_each_mala')?.disabled
  //   ).toBeTrue();
  //   expect(component.stoneEntryForm.get('st_total_mala')?.disabled).toBeTrue();

  //   // Check validators for By Gram fields
  //   expect(
  //     component.stoneEntryForm
  //       .get('st_each_stone_weight')
  //       ?.hasValidator(Validators.required)
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm
  //       .get('st_total_stone_weight')
  //       ?.hasValidator(Validators.required)
  //   ).toBeTrue();
  //   expect(
  //     component.stoneEntryForm
  //       .get('st_per_gram_price')
  //       ?.hasValidator(Validators.required)
  //   ).toBeTrue();
  // }));

  // it('should calculate st_quantity and st_per_stone_price for By Mala', fakeAsync(() => {
  //   component.onDiamondSelectionChange('By Mala');
  //   tick(100);
  //   fixture.detectChanges();

  //   component.stoneEntryForm.get('st_stone_in_each_mala')?.setValue(10);
  //   component.stoneEntryForm.get('st_total_mala')?.setValue(5);
  //   component.stoneEntryForm.get('st_per_mala_price')?.setValue(100);
  //   tick(100); // Debounce time
  //   fixture.detectChanges();

  //   expect(component.calculatedQuantity).toBe(50);
  //   expect(component.stoneEntryForm.get('st_quantity')?.value).toBe(50);
  //   expect(component.calculatedPerStonePrice).toBe(10);
  //   expect(component.stoneEntryForm.get('st_per_stone_price')?.value).toBe(
  //     '10.000'
  //   );
  // }));

  it('should calculate st_quantity and st_per_stone_price for By Gram', fakeAsync(() => {
    component.onDiamondSelectionChange('By Gram');
    tick(100);
    fixture.detectChanges();

    component.stoneEntryForm.get('st_total_stone_weight')?.setValue(null);
    component.stoneEntryForm.get('st_each_stone_weight')?.setValue(2);
    component.stoneEntryForm.get('st_per_gram_price')?.setValue(null);
    tick(100); // Debounce time
    fixture.detectChanges();

    expect(component.calculatedQuantity).toBe(null);
    expect(component.stoneEntryForm.get('st_quantity')?.value).toBe('');
    expect(component.calculatedPerStonePrice).toBe(null);
    expect(
      component.stoneEntryForm.get('st_per_stone_price')?.value
    ).toBeUndefined();
  }));

  it('should show error for oversized image', () => {
    const mockFile = new File(
      [new Array(3 * 1024 * 1024).join('a')],
      'large.png',
      { type: 'image/png' }
    ); // 3MB file
    const mockEvt = {
      target: { files: [mockFile], value: '' },
    } as unknown as Event;

    component.onImageSelected(mockEvt, 0);
    expect(component.selectedFiles[0]).toBeNull();
    expect(component.imagePreviews[0]).toBeNull();
    expect(component.fileUploadError[0]).toBe(
      'File size should not exceed 2MB.'
    );
  });

  it('should show error for invalid image type', () => {
    const mockFile = new File([''], 'test.txt', { type: 'text/plain' });
    const mockEvt = {
      target: { files: [mockFile], value: '' },
    } as unknown as Event;

    component.onImageSelected(mockEvt, 0);
    expect(component.selectedFiles[0]).toBeNull();
    expect(component.imagePreviews[0]).toBeNull();
    expect(component.fileUploadError[0]).toBe(
      'Only JPG, PNG, WEBP images are allowed.'
    );
  });

  // it('should call createRawMetalEntry and show success on valid form submission (By Mala)', fakeAsync(() => {
  //   component.onDiamondSelectionChange('By Mala');
  //   tick(100);
  //   fixture.detectChanges();

  //   component.stoneEntryForm.patchValue({
  //     st_category: 'Gem',
  //     st_code: 'G001',
  //     st_name: 'Ruby',
  //     st_size: 'Small',
  //     st_color: 'Red',
  //     st_per_mala_price: 1000,
  //     st_stone_in_each_mala: 10,
  //     st_total_mala: 2,
  //   });
  //   // Ensure calculated values are set before submission
  //   tick(100); // Trigger calculation
  //   fixture.detectChanges();

  //   mockRawMetalService.createRawMetalEntry.and.returnValue(
  //     of({ success: true })
  //   );

  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(component.stoneEntryForm.valid).toBeTrue();
  //   expect(mockRawMetalService.createRawMetalEntry).toHaveBeenCalled();
  //   expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
  //     'Stone Entry added successfully!',
  //     'Success'
  //   );
  //   expect(component.stoneEntryForm.pristine).toBeTrue(); // Check if form is reset
  //   expect(component.selectedDiamond).toBe(''); // Check if selectedDiamond is reset
  //   expect(component.imagePreviews[0]).toBeNull(); // Check if image previews are reset
  // }));

  // it('should call createRawMetalEntry and show success on valid form submission (By Stone)', () => {
  //   component.onDiamondSelectionChange('By Stone');
  //   fixture.detectChanges();

  //   component.stoneEntryForm.patchValue({
  //     st_category: 'Gem',
  //     st_code: 'G002',
  //     st_name: 'Sapphire',
  //     st_size: 'Medium',
  //     st_color: 'Blue',
  //     st_quantity: 50,
  //     st_per_stone_price: 20,
  //   });
  //   fixture.detectChanges();

  //   mockRawMetalService.createRawMetalEntry.and.returnValue(
  //     of({ success: true })
  //   );

  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(component.stoneEntryForm.valid).toBeFalse();
  //   expect(mockRawMetalService.createRawMetalEntry).toHaveBeenCalled();
  //   expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
  //     'Stone Entry added successfully!',
  //     'Success'
  //   );
  // });

  // it('should call createRawMetalEntry and show success on valid form submission (By Gram)', fakeAsync(() => {
  //   component.onDiamondSelectionChange('By Gram');
  //   tick(100);
  //   fixture.detectChanges();

  //   component.stoneEntryForm.patchValue({
  //     st_category: 'Gem',
  //     st_code: 'G003',
  //     st_name: 'Emerald',
  //     st_size: 'Large',
  //     st_color: 'Green',
  //     st_each_stone_weight: 0.5,
  //     st_total_stone_weight: 25,
  //     st_per_gram_price: 500,
  //   });
  //   tick(100); // Trigger calculation
  //   fixture.detectChanges();

  //   mockRawMetalService.createRawMetalEntry.and.returnValue(
  //     of({ success: true })
  //   );

  //   component.onSubmit();
  //   fixture.detectChanges();

  //   expect(component.stoneEntryForm.valid).toBeTrue();
  //   expect(mockRawMetalService.createRawMetalEntry).toHaveBeenCalled();
  //   expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
  //     'Stone Entry added successfully!',
  //     'Success'
  //   );
  // }));

  it('should show error and not submit on invalid form', () => {
    component.onSubmit();
    fixture.detectChanges();

    expect(component.stoneEntryForm.invalid).toBeTrue();
    expect(mockRawMetalService.createRawMetalEntry).not.toHaveBeenCalled();
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      'Form is invalid. Please check the fields.',
      'Validation Error'
    );
  });
});
