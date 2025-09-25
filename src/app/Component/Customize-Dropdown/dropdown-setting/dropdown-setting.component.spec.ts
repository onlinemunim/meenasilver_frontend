import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DropdownSettingComponent } from './dropdown-setting.component';
import { ToastrModule } from 'ngx-toastr';
import { NotificationService } from '../../../Services/notification.service';
import { NavbarService } from '../../../Services/navbar.service';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DropdownSettingComponent', () => {
  let component: DropdownSettingComponent;
  let fixture: ComponentFixture<DropdownSettingComponent>;
  let navbarService: jasmine.SpyObj<NavbarService>;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockSubmenu = [
    {
      parentLabel: 'Main',
      parentPath: '/main',
      submenu: [
        { path: '/sub1', lable: 'Sub 1', visible: false },
        { path: '/sub2', lable: 'Sub 2', visible: true }
      ]
    }
  ];

  beforeEach(async () => {
    const navbarSpy = jasmine.createSpyObj('NavbarService', [
      'getSubMenuItems',
      'toggleVisibility'
    ]);
    const notificationSpy = jasmine.createSpyObj('NotificationService', ['showSuccess']);

    await TestBed.configureTestingModule({
      imports: [
        DropdownSettingComponent,
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule // ✅ Fix for missing HttpClient
      ],
      providers: [
        { provide: NavbarService, useValue: navbarSpy },
        { provide: NotificationService, useValue: notificationSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {}
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DropdownSettingComponent);
    component = fixture.componentInstance;
    navbarService = TestBed.inject(NavbarService) as jasmine.SpyObj<NavbarService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;

    navbarService.getSubMenuItems.and.returnValue(JSON.parse(JSON.stringify(mockSubmenu)));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load submenu groups from service', () => {
    expect(component.submenuGroups.length).toBe(1);
    expect(component.submenuGroups[0].submenu.length).toBe(2);
  });

  it('should select all submenu items', () => {
    component.selectAllSubmenu();
    component.submenuGroups[0].submenu.forEach((item: { visible: any }) => {
      expect(item.visible).toBeTrue();
    });
  });

  it('should unselect all submenu items', () => {
    component.unselectAllSubmenu();
    component.submenuGroups[0].submenu.forEach((item: { visible: any }) => {
      expect(item.visible).toBeFalse();
    });
  });

  it('should call toggleVisibility with correct arguments in toggleSubItem()', () => {
    const item = mockSubmenu[0].submenu[0];
    component.toggleSubItem(item.path, mockSubmenu[0].parentPath);
    expect(navbarService.toggleVisibility).toHaveBeenCalledWith(item.path, true, mockSubmenu[0].parentPath);
  });


});
