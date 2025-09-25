// import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
// import { StockMetalComponent } from './stock-metal.component';
// import { NotificationService } from '../../../../Services/notification.service';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { of, throwError } from 'rxjs';
// import { MetalService } from '../../../../Services/metal.service';
// import { FirmSelectionService } from '../../../../Services/firm-selection.service';
// import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
// import { provideHttpClient } from '@angular/common/http';
// import { provideRouter } from '@angular/router';

// describe('StockMetalComponent', () => {
//   let component: StockMetalComponent;
//   let fixture: ComponentFixture<StockMetalComponent>;
//   let metalServiceSpy: jasmine.SpyObj<MetalService>;
//   let notificationSpy: jasmine.SpyObj<NotificationService>;
//   let stockGeneralServiceSpy: jasmine.SpyObj<StockGeneralService>;

//   const mockFirmSelectionService = {
//     selectedFirmName$: of({ id: 2 }),
//   };

//   beforeEach(async () => {
//     spyOn(localStorage, 'getItem').and.callFake((key: string) => {
//       if (key === 'user') return JSON.stringify({ id: 1 });
//       if (key === 'createdProductId') return '1';
//       return null;
//     });

//     metalServiceSpy = jasmine.createSpyObj('MetalService', [
//       'CreateMetal',
//       'getMetalList',
//       'getMetalsByProductId',
//       'getUnitTypes',
//       'getArticleTypes'
//     ]);

//     notificationSpy = jasmine.createSpyObj('NotificationService', [
//       'showSuccess',
//       'showError',
//     ]);

//     stockGeneralServiceSpy = jasmine.createSpyObj('StockGeneralService', [
//       'getProductId',
//       'getProductById',
//     ]);
//     stockGeneralServiceSpy.getProductId.and.returnValue(1);
//     stockGeneralServiceSpy.getProductById.and.returnValue(
//       of({ data: { id: 1, name: 'Test Product', unique_code_sku: 'ABC123', type: 'Gold' } })
//     );

//     await TestBed.configureTestingModule({
//       imports: [StockMetalComponent, ReactiveFormsModule],
//       providers: [
//         FormBuilder,
//         { provide: MetalService, useValue: metalServiceSpy },
//         { provide: NotificationService, useValue: notificationSpy },
//         { provide: FirmSelectionService, useValue: mockFirmSelectionService },
//         { provide: StockGeneralService, useValue: stockGeneralServiceSpy },
//         provideHttpClient(),
//         provideRouter([]),
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(StockMetalComponent);
//     component = fixture.componentInstance;

//     metalServiceSpy.getMetalList.and.returnValue(of({ data: [{ metal_type: 'Gold' }] }));
//     metalServiceSpy.getArticleTypes.and.returnValue(of({ data: ['Ring'] }));
//     metalServiceSpy.getUnitTypes.and.returnValue(['Gram']);
//     metalServiceSpy.getMetalsByProductId.and.returnValue(of({ data: [] }));

//     fixture.detectChanges();
//   });

//   it('should create component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize form on ngOnInit', () => {
//     component.ngOnInit();
//     expect(component.metalform).toBeDefined();
//   });

//   it('should call getMetalList on init', () => {
//     const spy = spyOn(component, 'getMetalList');
//     component.ngOnInit();
//     expect(spy).toHaveBeenCalled();
//   });

//   it('should call getMetalTypes and getArticleTypes on firm selection', () => {
//     component.ngOnInit();
//     expect(metalServiceSpy.getMetalList).toHaveBeenCalled();
//     expect(metalServiceSpy.getArticleTypes).toHaveBeenCalled();
//   });

//   it('should populate unitTypes from service', () => {
//     component.ngOnInit();
//     expect(component.unitTypes).toEqual(['Gram']);
//   });
//   it('should handle "+ Add Other" in material category', () => {
//     const mockEvent = { target: { value: '+ Add Other' } };
//     component.onMaterialCategoryChange(mockEvent);
//     expect(component.showMetalTypeSelectTag).toBeFalse();
//     expect(component.showMetalTypeInputTag).toBeTrue();
//   });

//   it('should handle "+ Add Other" in article category', () => {
//     const mockEvent = { target: { value: '+ Add Other' } };
//     component.onArticalChange(mockEvent);
//     expect(component.showArticalTypeSelectTag).toBeFalse();
//     expect(component.showArticalTypeInputTag).toBeTrue();
//   });

//   it('should reset article field', () => {
//     component.showArticalTypeSelectTag = false;
//     component.showArticalTypeInputTag = true;
//     component.resetArticalField();
//     expect(component.showArticalTypeSelectTag).toBeTrue();
//     expect(component.showArticalTypeInputTag).toBeFalse();
//   });

//   it('should reset material category field', () => {
//     component.showMetalTypeSelectTag = false;
//     component.showMetalTypeInputTag = true;
//     component.resetCategoryField();
//     expect(component.showMetalTypeSelectTag).toBeTrue();
//     expect(component.showMetalTypeInputTag).toBeFalse();
//   });

//   it('should call getMetalList and sort metals by created_at descending', () => {
//     const now = new Date();
//     metalServiceSpy.getMetalsByProductId.and.returnValue(
//       of({
//         data: [
//           { id: 1, created_at: new Date(now.getTime() - 10000), product_id: 1 },
//           { id: 2, created_at: now, product_id: 1 }
//         ]
//       })
//     );

//     component.getMetalList();

//     expect(component.metalDataList[0].id).toBe(2);
//   });
// });
