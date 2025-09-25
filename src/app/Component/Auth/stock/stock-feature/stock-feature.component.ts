import { StockGeneralService } from './../../../../Services/Product_Creation/stock-general.service';
import { ProductFeatureService } from './../../../../Services/product-feature.service';
import { ChangeDetectorRef, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from './../../../../Services/product.service';
import { NotificationService } from '../../../../Services/notification.service';
import { NgFor, NgIf } from '@angular/common';
import { FirmSelectionService } from './../../../../Services/firm-selection.service';
import { of } from 'rxjs';
import { selectedFirmName } from './../../../../Services/firm-selection.service';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';

interface Feature {
  id: number;
  catagoryname: string;
  featurename: string;
  featurestatus: 'yes' | 'no' | 1 | 0 | '1' | '0';
  firm_id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-stock-feature',
  imports: [ReactiveFormsModule, NgFor, NgIf],
  templateUrl: './stock-feature.component.html',
  styleUrl: './stock-feature.component.css',
})
export class StockFeatureComponent implements OnInit {
  featutreListInReverce: any;
  newlyCreatedProduct: any;
  createdProduct: any;

  constructor(
    private productservice: ProductService,
    private fb: FormBuilder,
    public notificationService: NotificationService,
    private ProductFeatureService: ProductFeatureService,
    private firmSelectionService: FirmSelectionService,
    private cdRef: ChangeDetectorRef,
    private stockGeneralService: StockGeneralService,
    private tabCommService: TabCommunicationService,
    private sharedProductService:SharedProductService,
  ) {}

  featureForm!: FormGroup;
  featureDataList: Feature[] = [];
  productId: any;
  editingId: any;
  editButton: boolean = false;
  addButton: boolean = true;
  selectedFirm: selectedFirmName | null = null;

  onCtrlEnter() {
    if (this.addButton) { // Only add if in 'add' mode
      this.addFeature();
    }
  }

  ngOnInit(): void {
    this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
      this.selectedFirm = firm?.id;
      this.initform();
      this.getFeaturesList();
      this.getCurrentProductData();

      //for edit old data
      if(this.getIdFromSharedService()){
        this.getFeaturesListForEdit();
      }
    });
  }

  getCurrentUserId() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || '';
  }

  initform() {
    this.productId = this.stockGeneralService.getProductId();
    console.log('Accessed Product ID:', this.productId);
    const userId = this.getCurrentUserId();
    this.featureForm = this.fb.group({
      catagoryname: ['', Validators.required],
      featurename: ['', Validators.required],
      featurestatus: [false, Validators.required],
      firm_id: [this.selectedFirm, Validators.required],
      user_id: [userId, Validators.required],
      product_id: [localStorage.getItem('createdProductId')],
    });
  }

  addFeature(): void {
    const formValue = { ...this.featureForm.value };
    formValue.featurestatus = formValue.featurestatus === true ? 'yes' : 'no';


    const alreadyHasYesFeature = this.featureDataList.some(
      (feature) => String(feature.featurestatus).toLowerCase() === 'yes' || String(feature.featurestatus) === '1'
    );

    if (alreadyHasYesFeature && formValue.featurestatus === 'yes') {
      this.notificationService.showError(
        'You can add only one Top feature.',
        'Feature Constraint'
      );
      return;
    }

    this.ProductFeatureService.createFeature(formValue).subscribe(
      (response) => {
        const newFeature = {
          ...response.data,
          featurestatus:
            String(response.data.featurestatus).toLowerCase() === 'yes' || String(response.data.featurestatus) === '1'
              ? 'yes'
              : 'no'
        };

        this.featureDataList.unshift(newFeature);
        this.featureDataList.sort((a, b) => {
          if (a.featurestatus === 'yes' && b.featurestatus !== 'yes') return -1;
          if (a.featurestatus !== 'yes' && b.featurestatus === 'yes') return 1;
          return 0;
        });

        this.featureForm.reset();
        this.onClear();

        this.notificationService.showSuccess('Feature added successfully.', 'Success');
      },
      (error) => {
        console.error('Error creating feature:', error);
        this.notificationService.showError('Failed to create feature. Please try again.', 'Error');
      }
    );
  }



  getFeaturesList(): void {
    const productId = this.getProductId();

    if (!productId) {
      console.warn('No product ID found.');
      return;
    }

    this.ProductFeatureService.getFeaturesByProductId(productId).subscribe(
      (response: any) => {
        if (response?.data?.length) {
          this.featureDataList = response.data
            .filter((feature: any) => feature.product_id === productId)
            .map((feature: any) => ({
              ...feature,
              featurestatus:
                feature.featurestatus === 1 ||
                feature.featurestatus === '1' ||
                feature.featurestatus === true ||
                feature.featurestatus === 'yes'
                  ? 'yes'
                  : 'no',
            }));

          this.featureDataList.sort((a, b) => {
            if (a.featurestatus === 'yes' && b.featurestatus !== 'yes')
              return -1;
            if (a.featurestatus !== 'yes' && b.featurestatus === 'yes')
              return 1;
            return 0;
          });

          console.log('Feature Data List', this.featureDataList);
        } else {
          this.featureDataList = [];
          console.warn('No feature data found.');
        }

        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error fetching feature data:', error);
        this.featureDataList = [];
      }
    );
  }


  patchData(id: any) {
    this.ProductFeatureService.getFeatureList(id).subscribe((response: any) => {
      const feature = response.data;

      const isYes =
        String(feature.featurestatus).toLowerCase() === 'yes' ||
        String(feature.featurestatus) === '1';

      this.featureForm.patchValue({
        ...feature,
        featurestatus: isYes,
      });

      this.editingId = id;
      this.editButton = true;
      this.addButton = false;
    });
  }


  editfeature(): void {
    const formValue = { ...this.featureForm.value };
    formValue.featurestatus = formValue.featurestatus ? 'yes' : 'no';
    const alreadyHasYesFeature = this.featureDataList.some((feature) => {
      const status = String(feature.featurestatus).toLowerCase();
      return feature.id !== this.editingId && (status === 'yes' || status === '1');
    });

    if (alreadyHasYesFeature && formValue.featurestatus === 'yes') {
      this.notificationService.showError(
        'You can only have one feature with status "yes".',
        'Feature Constraint'
      );
      return;
    }

    this.ProductFeatureService.updateFeature(this.editingId, formValue).subscribe(
      (response: any) => {
        this.notificationService.showSuccess('Feature updated successfully.', 'Success');
        this.getFeaturesList();
        this.editButton = false;
        this.addButton = true;
        this.onClear();
      },
      (error: any) => {
        this.notificationService.showError('Failed to update feature.', 'Error');
      }
    );
  }

  deletefeature(id: any): void {
    const confirmed = window.confirm('Do you really want to delete this feature?');

    if (!confirmed) {
      return;
    }

    this.ProductFeatureService.deleteFeature(id).subscribe({
      next: () => {
        this.notificationService.showSuccess(
          'Feature deleted successfully.',
          'Success'
        );
        this.getFeaturesList();
      },
      error: () => {
        this.notificationService.showError(
          'Failed to delete feature. Please try again.',
          'Error'
        );
      },
    });
    this.onClear();
  }

  onClear() {
    this.featureForm.reset();
    this.featureForm.patchValue({
      firm_id: this.selectedFirm,
      user_id: this.getCurrentUserId(),
      product_id: this.productId,
      featurestatus: false,
    });
    this.editButton = false;
    this.addButton = true;
  }

  onSubmit() {
    console.log(this.featureForm.value);
  }

  getProductId() {
    this.productId = localStorage.getItem('createdProductId');
    return this.productId ? JSON.parse(this.productId) : null;
  }

  generalProductDetail() {
    this.newlyCreatedProduct = this.stockGeneralService.getCreatedProduct();
    console.log(this.createdProduct);
  }

  getCurrentProductData() {
    this.stockGeneralService
      .getProductById(localStorage.getItem('createdProductId'))
      .subscribe((respone: any) => {
        this.newlyCreatedProduct = respone.data;
      });
  }

  goToPackagingTab() {
    this.tabCommService.setActiveTab(3);
  }

  goToPriceDetailsTab() {
    this.tabCommService.setActiveTab(5);
  }

  //Get id from shared-product service
  getIdFromSharedService(){
    return this.sharedProductService.getProductId();
  }

  //this for edit old data
  getFeaturesListForEdit(): void {
    const productIdStr = this.getIdFromSharedService();
    if (!productIdStr) return;

    const productId = Number(productIdStr);
    if (isNaN(productId)) {
      console.error('Invalid product ID:', productIdStr);
      return;
    }

    this.ProductFeatureService.getFeaturesByProductId(productId).subscribe(
      (response: any) => {
        if (response?.data?.length) {
          this.featureDataList = response.data
            .filter((feature: any) => feature.product_id === productId)
            .map((feature: any) => ({
              ...feature,
              featurestatus:
                feature.featurestatus === 1 ||
                feature.featurestatus === '1' ||
                feature.featurestatus === true ||
                feature.featurestatus === 'yes'
                  ? 'yes'
                  : 'no',
            }));

          this.featureDataList.sort((a, b) => {
            if (a.featurestatus === 'yes' && b.featurestatus !== 'yes')
              return -1;
            if (a.featurestatus !== 'yes' && b.featurestatus === 'yes')
              return 1;
            return 0;
          });

          console.log('Feature Data List', this.featureDataList);
        } else {
          this.featureDataList = [];
          console.warn('No feature data found.');
        }

        this.cdRef.detectChanges();
      },
      (error) => {
        console.error('Error fetching feature data:', error);
        this.featureDataList = [];
      }
    );
  }

  focusNext(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();

    const target = keyboardEvent.target as HTMLElement;
    const form = target.closest('form');
    if (!form) return;

    const focusable = Array.from(
      form.querySelectorAll<HTMLElement>('input, select, textarea, button')
    ).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1);

    const index = focusable.indexOf(target);
    if (index > -1 && index + 1 < focusable.length) {
      focusable[index + 1].focus();
    }
  }
}
