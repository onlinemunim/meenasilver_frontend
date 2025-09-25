import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { StatesFilterComponent } from './states-filter.component';
import { StatesService } from '../../../../Services/states.service';
import { CountryService } from '../../../../Services/country.service';
import { ApiService } from '../../../../Services/api.service';
import { NotificationService } from '../../../../Services/notification.service';

// Mock Router
class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

// Mock Services
class MockCountryService {
  getAllCountries() {
    return of({
      data: [
        { id: 1, name: 'India' },
        { id: 2, name: 'USA' },
      ]
    });
  }
}

class MockStatesService {
  getAllStates() {
    return of({
      data: [
        { id: 1, name: 'Karnataka' },
        { id: 2, name: 'California' },
      ]
    });
  }
}

class MockNotificationService {
  showSuccess(msg: string, title: string) {}
  showError(msg: string, title: string) {}
  showInfo(msg: string, title: string) {}
  showWarning(msg: string, title: string) {}
  showDefault(msg: string, title: string) {}
}

describe('StatesFilterComponent', () => {
  let component: StatesFilterComponent;
  let fixture: ComponentFixture<StatesFilterComponent>;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatesFilterComponent, HttpClientTestingModule],
      providers: [
        { provide: StatesService, useClass: MockStatesService },
        { provide: CountryService, useClass: MockCountryService },
        { provide: NotificationService, useClass: MockNotificationService },
        { provide: ApiService, useValue: {} },
        { provide: Router, useClass: MockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatesFilterComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as any;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.stateFilterForm).toBeTruthy();
    expect(component.stateFilterForm.value).toEqual({
      name: '',
      id: '',
      country_name: '',
      state_name: ''
    });
  });

  it('should load countries from the CountryService', () => {
    expect(component.countries).toContain('India');
    expect(component.countries).toContain('USA');
  });

  it('should load states from the StatesService', () => {
    expect(component.states).toContain('Karnataka');
    expect(component.states).toContain('California');
  });

  it('should call router.navigate on submit with form values', () => {
    component.stateFilterForm.setValue({
      name: 'State 1',
      id: '1',
      country_name: 'India',
      state_name: 'Karnataka'
    });

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: component.stateFilterForm.value,
      queryParamsHandling: 'merge'
    });
  });

  it('should reset the form and call router.navigate on reset', () => {
    component.stateFilterForm.setValue({
      name: 'Something',
      id: '123',
      country_name: 'India',
      state_name: 'Karnataka'
    });

    component.onReset();

    expect(component.stateFilterForm.value).toEqual({
      name: null,
      id: null,
      country_name: null,
      state_name: null
    });

    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: component.stateFilterForm.value,
      queryParamsHandling: 'merge'
    });
  });
});
