// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ProductCreationComponent } from './product-creation.component';
// import { provideHttpClient } from '@angular/common/http';
// import { provideToastr } from 'ngx-toastr';
// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';

// describe('ProductCreationComponent', () => {
//   let component: ProductCreationComponent;
//   let fixture: ComponentFixture<ProductCreationComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ProductCreationComponent],
//       providers: [
//         provideHttpClient(),
//         provideToastr({
//           timeOut: 1000,
//           positionClass: 'toast-bottom-right',
//           preventDuplicates: true,
//           progressBar: true,
//           progressAnimation: 'decreasing',
//           newestOnTop: true,
//           tapToDismiss: true
//         }),
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             params: of({}),
//             queryParams: of({}),
//             snapshot: {
//               paramMap: {
//                 get: (key: string) => null,
//               }
//             }
//           }
//         }
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ProductCreationComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
