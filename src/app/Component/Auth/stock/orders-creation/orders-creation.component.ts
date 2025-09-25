  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
  import { DecimalPipe, NgFor, NgIf } from '@angular/common';
  import { OrderCreationService } from '../../../../Services/order-creation.service';
  import { NotificationService } from '../../../../Services/notification.service';
  import { FirmSelectionService } from '../../../../Services/firm-selection.service';
  import { RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

  @Component({
    selector: 'app-orders-creation',
    standalone: true,
    imports: [NgFor,NgIf, FormsModule, ReactiveFormsModule,RouterLink],
    templateUrl: './orders-creation.component.html',
    styleUrl: './orders-creation.component.css'
  })
  export class OrdersCreationComponent implements OnInit {
    orderCreationForm!: FormGroup;
    completedProductCodes: any[] = [];
    metalDataList: any;
    orederCreationDataList: any;
    selectedFirm: any;
    completeProductData: any;
    totalMetalPrice: any;
    totalStonePrice:any;
    finalValue:any;
    kalakarSuppliers: any;
    data: any[] = [];


    constructor(private fb: FormBuilder, private orderCreationService:OrderCreationService,private notificationService:NotificationService,private firmSelectionService:FirmSelectionService) {}

    ngOnInit(): void {
      this.firmSelectionService.selectedFirmName$.subscribe((firm: any) => {
        this.selectedFirm = firm?.id;
        this.initForm();
        this.getProductCodes();
        this.getOrderCreationDataList();
        this.getAssignedName();

        this.orderCreationForm.get('ordc_quantity')?.valueChanges.subscribe(() => {
          this.updateCalculatedMetalAndStoneData();
        });

      });
    }

    initForm() {
      this.orderCreationForm = this.fb.group({
        ordc_product_code: [''],
        ordc_product_name: [''],
        ordc_quantity: [''],
        ordc_assined_to: [''],
        ordc_metal_price: [''],
        ordc_stone_price: [''],
        ordc_final_value: [''],
        ordc_metal_details: [''],
        ordc_stone_details: [''],
        ordc_firm_id: this.selectedFirm,
        ordc_image: [''],
      });
    }



    handleAssigneeChange(event: Event): void {
      const selectElement = event.target as HTMLSelectElement;
      const userId = selectElement.value;
      this.onAssigneeSelected(userId);
    }



    getAssignedName() {
      this.orderCreationService.getKalakarSuppliers().subscribe((response: any) => {
        this.kalakarSuppliers = response.data ?? [];

        if (this.orederCreationDataList?.length) {
          this.orederCreationDataList = this.mapOrdersWithNames(this.orederCreationDataList);
        }
      });
    }



    onAssigneeSelected(userId: string) {
      const selectedUser = this.kalakarSuppliers.find((u: any) => u.id == userId);
      if (selectedUser) {
        this.orderCreationForm.get('ordc_assined_to')?.setValue(userId);
        const fullName = `${selectedUser.name ?? ''} ${selectedUser.user_last_name ?? ''}`.trim();
      }
    }


    getProductCodes() {
      let params = new HttpParams().set('firm_id', this.selectedFirm);
      this.orderCreationService.getGeneralProductCodeForProductDesign(params).subscribe((res: any) => {
        this.completedProductCodes = res.data;
      });
    }

    onProductCodeChange(event: Event) {
      this.completeProductData = null;
      this.totalMetalPrice = 0;
      this.totalStonePrice = 0;
      this.finalValue = 0;

      this.orderCreationForm.patchValue({
        ordc_product_name: '',
        ordc_image: '',
        ordc_metal_details: '',
        ordc_stone_details: '',
        ordc_quantity: ''
      });

      const selectedCode = (event.target as HTMLSelectElement).value;

      const selectedProduct = this.completedProductCodes.find(
        item => item.unique_code_sku === selectedCode
      );

      this.completeProductData = selectedProduct;

      if (selectedProduct) {
        this.orderCreationForm.patchValue({
          ordc_product_code: selectedProduct.unique_code_sku,
          ordc_product_name: selectedProduct.product_name || '',
          ordc_image: selectedProduct.product_image || selectedProduct.product_image_2 || selectedProduct.product_image_3 || selectedProduct.product_image_4 || selectedProduct.product_image_5 ,
        });

        // Total metal price
        this.totalMetalPrice = selectedProduct.assembly_metal_part?.reduce(
          (sum: number, item: any) => sum + (+item.total_price || 0), 0
        ) || 0;

        // Total stone price
        this.totalStonePrice = selectedProduct.assembly_stone?.reduce(
          (sum: number, item: any) => sum + (+item.total_price || 0), 0
        ) || 0;

        this.finalValue = this.totalMetalPrice + this.totalStonePrice;

        // Format metal data as JSON (object if 1 item, array if >1)
        const metalData = selectedProduct.assembly_metal_part;
        const formattedMetal = metalData?.length === 1 ? metalData[0] : metalData;

        // Format stone data as JSON (object if 1 item, array if >1)
        const stoneData = selectedProduct.assembly_stone;
        const formattedStone = stoneData?.length === 1 ? stoneData[0] : stoneData;

        this.orderCreationForm.patchValue({
          ordc_metal_details: JSON.stringify(formattedMetal),
          ordc_stone_details: JSON.stringify(formattedStone)
        });
      } else {
        this.orderCreationForm.patchValue({
          ordc_product_name: '',
          ordc_quantity: ''
        });
      }
    }

    addOrderCreationData() {
      if (!this.completeProductData) return;

      const metalList = this.completeProductData.assembly_metal_part?.map((metal: any) => {
        const calculatedQty = this.getMetalProductQuantity(metal);
        const totalSilver = this.getTotalSilverMetal(metal);
        return {
          ...metal,
          calculated_product_qty: calculatedQty,
          total_silver: totalSilver
        };
      });

      const stoneList = this.completeProductData.assembly_stone?.map((stone: any) => {
        const calculatedQty = this.getStoneProductQuantity(stone);
        const totalStone = this.getTotalStone(stone);
        return {
          ...stone,
          calculated_product_qty: calculatedQty,
          total_stone: totalStone
        };
      });

      const formattedMetal = metalList?.length === 1 ? metalList[0] : metalList;
      const formattedStone = stoneList?.length === 1 ? stoneList[0] : stoneList;

      this.totalMetalPrice = metalList?.reduce((sum: number, m: any) => sum + (+m.total_price || 0), 0) || 0;
      this.totalStonePrice = stoneList?.reduce((sum: number, s: any) => sum + (+s.total_price || 0), 0) || 0;
      this.finalValue = this.totalMetalPrice + this.totalStonePrice;
      const formData = {
        ...this.orderCreationForm.value,
        ordc_metal_price: this.totalMetalPrice,
        ordc_stone_price: this.totalStonePrice,
        ordc_final_value: this.finalValue,
        ordc_metal_details: JSON.stringify(formattedMetal),
        ordc_stone_details: JSON.stringify(formattedStone)
      };

      this.orderCreationService.createOrder(formData).subscribe(
        (res: any) => {
          this.notificationService.showSuccess('Order Created Successfully!', 'Success');
          this.clearForm();
          this.getOrderCreationDataList();
        },
        (error: any) => {
          console.error('❌ Error creating order:', error);
          this.notificationService.showError('Failed to create order. Please try again.', 'Error');
        }
      );
    }

    clearForm() {
      this.orderCreationForm.reset({
        ordc_firm_id: this.selectedFirm,
        ordc_product_code: '',
        ordc_assined_to:'',
      });
      this.completeProductData = null;
      this.totalMetalPrice = 0;
      this.totalStonePrice = 0;
      this.finalValue = 0;
    }


    getOrderCreationDataList() {
      let params = new HttpParams().set('firm_id', this.selectedFirm);
      this.orderCreationService.getOrders(params).subscribe((res: any) => {
        const orders = res.data.reverse();
        this.orederCreationDataList = orders;

        // if suppliers already loaded, map immediately
        if (this.kalakarSuppliers?.length) {
          this.orederCreationDataList = this.mapOrdersWithNames(orders);
        }
      });
    }

    private mapOrdersWithNames(orders: any[]) {
    return orders.map(order => {
    const assigneeId = order.assigned_to ?? order.ordc_assined_to;
    const assignee = this.kalakarSuppliers.find(
      (u: any) => String(u.id) === String(assigneeId)
    );
    return {
      ...order,
      assignee_name: assignee
        ? `${assignee.name} ${assignee.user_last_name ?? ''}`.trim()
        : 'Unknown'
    };
  });
}



    getEnteredQuantity(): number {
      return +this.orderCreationForm.get('ordc_quantity')?.value || 0;
    }

    getMetalProductQuantity(metal: any): number {
      const enteredQty = this.getEnteredQuantity();
      const metalQty = +metal.quantity || 0;
      const productQty = enteredQty * metalQty;
      metal.calculated_product_qty = productQty;
      return productQty;
    }

    getTotalSilverMetal(metal: any): number {
      const productQty = this.getMetalProductQuantity(metal);
      const perPieceWt = +metal.per_piece_weight || 0;
      const total = productQty * perPieceWt;
      metal.total_silver = total;
      return total;
    }

    getStoneProductQuantity(stone: any): number {
      const enteredQty = this.getEnteredQuantity();
      // const stoneQty = +stone.quantity || 0;
      // const productQty = enteredQty * stoneQty;
      stone.calculated_product_qty = enteredQty;
      return enteredQty;
    }

    getTotalStone(stone: any): number {
      const productQty = this.getStoneProductQuantity(stone);
      const stoneQty = +stone.quantity || 0;
      const total = productQty * stoneQty;
      stone.total_stone = total;
      return total;
    }

    updateCalculatedMetalAndStoneData(): void {
      if (!this.completeProductData) return;

      const metalList = this.completeProductData.assembly_metal_part?.map((metal: any) => {
        const calculatedQty = this.getMetalProductQuantity(metal);
        const totalSilver = this.getTotalSilverMetal(metal);
        return {
          ...metal,
          calculated_product_qty: calculatedQty,
          total_silver: totalSilver
        };
      });

      const stoneList = this.completeProductData.assembly_stone?.map((stone: any) => {
        const calculatedQty = this.getStoneProductQuantity(stone);
        const totalStone = this.getTotalStone(stone);
        return {
          ...stone,
          calculated_product_qty: calculatedQty,
          total_stone: totalStone
        };
      });

      // Recalculate totals
      this.totalMetalPrice = metalList?.reduce((sum: number, m: { total_price: string | number; }) => sum + (+m.total_price || 0), 0) || 0;
      this.totalStonePrice = stoneList?.reduce((sum: number, s: { total_price: string | number; }) => sum + (+s.total_price || 0), 0) || 0;
      this.finalValue = this.totalMetalPrice + this.totalStonePrice;

      const formattedMetal = metalList?.length === 1 ? metalList[0] : metalList;
      const formattedStone = stoneList?.length === 1 ? stoneList[0] : stoneList;

      // Patch to form
      this.orderCreationForm.patchValue({
        ordc_metal_details: JSON.stringify(formattedMetal),
        ordc_stone_details: JSON.stringify(formattedStone),
        ordc_metal_price: this.totalMetalPrice,
        ordc_stone_price: this.totalStonePrice,
        ordc_final_value: this.finalValue
      });
    }

    focusNext(event: Event) {
      const keyboardEvent = event as KeyboardEvent;
      keyboardEvent.preventDefault();

      const target = keyboardEvent.target as HTMLElement;
      const form = target.closest('form');
      if (!form) return;

      const focusableElements = Array.from(
        form.querySelectorAll<HTMLElement>('input, select, textarea, button')
      ).filter(el =>
        !el.hasAttribute('disabled') &&
        !el.hasAttribute('readonly') &&
        el.tabIndex !== -1 &&
        el.offsetParent !== null // Skips hidden elements
      );

      const currentIndex = focusableElements.indexOf(target);

      if (currentIndex !== -1 && currentIndex + 1 < focusableElements.length) {
        focusableElements[currentIndex + 1].focus();
      }
    }

  }
