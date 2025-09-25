import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FirmListComponent } from './firm-list.component';
import { FirmService } from '../../../Services/firm.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('FirmListComponent', () => {
  let component: FirmListComponent;
  let fixture: ComponentFixture<FirmListComponent>;
  let mockFirmService: jasmine.SpyObj<FirmService>;
  let router: Router;

  const mockFirmResponse = {
    data: [
      { id: 1, name: 'Firm 1' },
      { id: 2, name: 'Firm 2' }
    ]
  };

  beforeEach(async () => {
    mockFirmService = jasmine.createSpyObj('FirmService', ['getFirmsData', 'deleteFirm']);

    await TestBed.configureTestingModule({
      imports: [
        FirmListComponent,
        RouterTestingModule.withRoutes([]),
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: FirmService, useValue: mockFirmService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FirmListComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch firms data on init', () => {
    mockFirmService.getFirmsData.and.returnValue(of(mockFirmResponse));

    component.ngOnInit();

    expect(mockFirmService.getFirmsData).toHaveBeenCalled();
    expect(component.firmsdata).toEqual(mockFirmResponse.data);
  });

  it('should navigate to edit firm page', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.editFirm(123);
    expect(navigateSpy).toHaveBeenCalledWith(['firm/123/edit']);
  });

  it('should call deleteFirm and refresh data', () => {
    mockFirmService.deleteFirm.and.returnValue(of({ success: true }));
    mockFirmService.getFirmsData.and.returnValue(of(mockFirmResponse));

    spyOn(window, 'alert');

    component.deleteFirm(1);

    expect(mockFirmService.deleteFirm).toHaveBeenCalledWith(1);
    expect(mockFirmService.getFirmsData).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Firm deleted successfully!');
  });

  it('should call getFirmsData() in ngOnInit', () => {
    const getFirmsDataSpy = spyOn(component, 'getFirmsData');
    component.ngOnInit();
    expect(getFirmsDataSpy).toHaveBeenCalled();
  });

});
