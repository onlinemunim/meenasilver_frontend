import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { StockPackagingComponent } from './stock-packaging.component';
import { PackagingService } from '../../../../Services/Product_Creation/packaging.service';
import { ApiService } from '../../../../Services/api.service';
import { NotificationService } from '../../../../Services/notification.service';

describe('StockPackagingComponent', () => {
  let component: StockPackagingComponent;
  let fixture: ComponentFixture<StockPackagingComponent>;
  let packagingServiceSpy: jasmine.SpyObj<PackagingService>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  beforeEach(async () => {
    const packagingSpy = jasmine.createSpyObj('PackagingService', [
      'getPackagings',
      'createPackaging',
      'deletePackaging',
      'getMetalTypes',
      'getPackagingListByProductId'
    ]);

    const apiSpy = jasmine.createSpyObj('ApiService', ['getMetalTypes']);
    apiSpy.getMetalTypes.and.returnValue(of([{ id: 1, name: 'Metal Type 1' }, { id: 2, name: 'Metal Type 2' }]));


    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        StockPackagingComponent
      ],
      providers: [
        { provide: PackagingService, useValue: packagingSpy },
        { provide: ApiService, useValue: apiSpy },
        NotificationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StockPackagingComponent);
    component = fixture.componentInstance;
    packagingServiceSpy = TestBed.inject(PackagingService) as jasmine.SpyObj<PackagingService>;
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
