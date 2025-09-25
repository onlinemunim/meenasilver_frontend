import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../Services/notification.service';
import { CategoryService } from '../../../../Services/Category/category.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.css']
})
export class AddCategoryComponent implements OnInit {
  addCategoryForm!: FormGroup;
  selectedFirmId!: number;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private notificationService: NotificationService,
    private firmSelectionService: FirmSelectionService
  ) {}

  ngOnInit(): void {
    this.addCategoryForm = this.fb.group({
      newType:  [''],
      newCategoryName: ['', Validators.required],
      newGroupName: ['', Validators.required],
      newUnit: ['', Validators.required],
      MRP: ['', Validators.required],
    });

    // Get selected firm
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      if (firm?.id) {
        this.selectedFirmId = firm.id;
      }
    });
  }

  addCategory(): void {
    if (this.addCategoryForm.invalid) {
      this.notificationService.showError(
        'Please fill all required fields.',
        'Add Category'
      );
      return;
    }

    if (!this.selectedFirmId) {
      this.notificationService.showError(
        'Firm not selected. Cannot add category.',
        'Add Category'
      );
      return;
    }

    const payload = {
      Type: this.addCategoryForm.value.newType,
      name: this.addCategoryForm.value.newCategoryName,
      group: this.addCategoryForm.value.newGroupName,
      unit: this.addCategoryForm.value.newUnit,
      mrp: this.addCategoryForm.value.MRP,
      firm_id: this.selectedFirmId,
    };

    this.categoryService.createCategory(payload).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          `Category "${payload.name}" added successfully.`,
          'Add Category'
        );
        this.addCategoryForm.reset({
          newType: '',
          newCategoryName: '',
          newGroupName: '',
          newUnit: '',
          MRP: ''
        });
      },

      error: (err) => {
        this.notificationService.showError('Failed to save category.', 'Add Category');
        console.error('Add category error:', err);
      }
    });
  }
}
