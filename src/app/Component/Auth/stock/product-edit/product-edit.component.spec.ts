// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule } from '@angular/common/http/testing';

// import { ToastrModule } from 'ngx-toastr';

// import { ActivatedRoute } from '@angular/router';
// import { of } from 'rxjs';

// import { ProductEditComponent } from './product-edit.component';

// describe('ProductEditComponent', () => {
//   let component: ProductEditComponent;
//   let fixture: ComponentFixture<ProductEditComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [
//         ProductEditComponent,
//         HttpClientTestingModule,
//         ToastrModule.forRoot()
//       ],
//       providers: [
//         {
//           provide: ActivatedRoute,
//           useValue: {
//             // Provide any observables or snapshot data your component uses
//             params: of({ id: '123' }),
//             snapshot: {
//               paramMap: {
//                 get: (key: string) => '123',  // or whatever your component expects
//               }
//             }
//           }
//         }
//       ]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ProductEditComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
