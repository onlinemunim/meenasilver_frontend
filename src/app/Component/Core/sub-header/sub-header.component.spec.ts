import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubHeaderComponent } from './sub-header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of, BehaviorSubject } from 'rxjs';
import { FirmService } from '../../../Services/firm.service';
import { NavbarService } from '../../../Services/navbar.service';
import { FirmSelectionService } from '../../../Services/firm-selection.service';
import { RouterTestingModule } from '@angular/router/testing';

const mockFirmResponse = {
  data: [
    { id: 1, name: 'Firm One' },
    { id: 2, name: 'Firm Two' },
  ]
};

const mockFirmService = {
  getFirms: () => of(mockFirmResponse),
};

const mockNavbarService = {
  navbarOptions$: of([
    { path: 'home', lable: 'Home' },
    { path: 'contact', lable: 'Contact' },
  ]),
};

const mockFirmSelectionService = {
  selectedFirmName$: new BehaviorSubject(null),
  setselectedFirmName: jasmine.createSpy('setselectedFirmName'),
};

describe('SubHeaderComponent', () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SubHeaderComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        { provide: FirmService, useValue: mockFirmService },
        { provide: NavbarService, useValue: mockNavbarService },
        { provide: FirmSelectionService, useValue: mockFirmSelectionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch firm names on init', () => {
    expect(component.firmnames).toEqual(['Firm One', 'Firm Two']);
  });

  it('should set selected firm when firm not already selected', () => {
    expect(component.selectedFirm).toBe('Firm One');
    expect(mockFirmSelectionService.setselectedFirmName).toHaveBeenCalledWith({
      id: 1,
      name: 'Firm One',
    });
  });

  it('should toggle menu state', () => {
    expect(component.menuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.menuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.menuOpen).toBeFalse();
  });

  it('should fetch navbar options', () => {
    expect(component.navbarOptions).toEqual([
      { path: 'home', lable: 'Home' },
      { path: 'contact', lable: 'Contact' },
    ]);
  });

  it('should call setselectedFirmName on firm change', () => {
    component.onFirmChange('Firm Two');
    expect(mockFirmSelectionService.setselectedFirmName).toHaveBeenCalledWith({
      id: 2,
      name: 'Firm Two',
    });
  });
});
