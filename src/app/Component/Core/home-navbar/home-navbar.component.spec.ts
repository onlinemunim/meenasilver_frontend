import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeNavbarComponent } from './home-navbar.component';
import { NavbarService } from '../../../Services/navbar.service';
import { FirmService } from '../../../Services/firm.service';
import { FirmSelectionService } from '../../../Services/firm-selection.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, BehaviorSubject } from 'rxjs';

describe('HomeNavbarComponent', () => {
  let component: HomeNavbarComponent;
  let fixture: ComponentFixture<HomeNavbarComponent>;

  const mockFirmService = {
    getFirms: () =>
      of({
        data: [
          { id: 1, name: 'Firm A' },
          { id: 2, name: 'Firm B' },
        ],
      }),
  };

  const mockNavbarService = {
    navbarOptions$: of([
      { path: 'home', lable: 'Home' },
      { path: 'about', lable: 'About' },
    ]),
  };

  const mockFirmSelectionService = {
    selectedFirmName$: new BehaviorSubject(null),
    setselectedFirmName: jasmine.createSpy('setselectedFirmName'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        HomeNavbarComponent,
      ],
      providers: [
        { provide: FirmService, useValue: mockFirmService },
        { provide: NavbarService, useValue: mockNavbarService },
        { provide: FirmSelectionService, useValue: mockFirmSelectionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu state', () => {
    expect(component.menuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.menuOpen).toBeTrue();
    component.toggleMenu();
    expect(component.menuOpen).toBeFalse();
  });

  it('should have navbar options', () => {
    expect(component.navbarOptions).toEqual([
      { path: 'home', lable: 'Home' },
      { path: 'about', lable: 'About' },
    ]);
  });

  it('should call firmService and set firmnames', () => {
    expect(component.firmnames).toEqual(['Firm A', 'Firm B']);
  });

  it('should call firmSelectionService onFirmChange', () => {
    component.onFirmChange('Firm A');
    expect(mockFirmSelectionService.setselectedFirmName).toHaveBeenCalledWith({
      id: 1,
      name: 'Firm A',
    });
  });
});
