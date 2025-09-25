import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PackagingFormComponent } from './packaging-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BehaviorSubject } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { RawMetalService } from '../../../../Services/Raw_Metal/raw-metal.service';
import { StockGeneralService } from '../../../../Services/Product_Creation/stock-general.service';
import { PackagingService } from '../../../../Services/Product_Creation/packaging.service';
import { FirmSelectionService } from '../../../../Services/firm-selection.service';
import { TabCommunicationService } from '../../../../Services/Stock-Tabs/tab-communication.service';
import { NotificationService } from '../../../../Services/notification.service';
import { SharedProductService } from '../../../../Services/Product_Creation/shared-product.service';

fdescribe('PackagingFormComponent', () => {
  let component: PackagingFormComponent;
  let fixture: ComponentFixture<PackagingFormComponent>;

  let mockPackagingService: any;
  let mockFirmSelectionService: any;

  beforeEach(async () => {
    mockPackagingService = jasmine.createSpyObj('PackagingService', [
      'getPackagings',
      'createPackaging',
      'deletePackaging',
      'getPackaging',
      'updatePackaging',
      'getPackagingListByProductId'
    ]);

    mockFirmSelectionService = {
      selectedFirmName$: new BehaviorSubject({ id: 1, name: 'Test Firm' })
    };

    await TestBed.configureTestingModule({
      imports: [
        PackagingFormComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: PackagingService, useValue: mockPackagingService },
        { provide: FirmSelectionService, useValue: mockFirmSelectionService },
        RawMetalService,
        StockGeneralService,
        TabCommunicationService,
        NotificationService,
        SharedProductService,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PackagingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
