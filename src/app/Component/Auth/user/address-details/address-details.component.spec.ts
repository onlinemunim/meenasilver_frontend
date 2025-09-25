import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddressDetailsComponent } from './address-details.component';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

// Mocks
class MockCountryService {
  getCountries() {
    return of({ data: [{ id: 1, name: 'India' }, { id: 2, name: 'USA' }] });
  }
}

class MockStatesService {
  getStates() {
    return of({ data: [{ id: 1, name: 'Gujarat' }, { id: 2, name: 'California' }] });
  }
}

class MockCitiesService {
  getCities() {
    return of({ data: [{ id: 1, name: 'Ahmedabad' }, { id: 2, name: 'Los Angeles' }] });
  }
}

describe('AddressDetailsComponent', () => {
  let component: AddressDetailsComponent;
  let fixture: ComponentFixture<AddressDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddressDetailsComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: 'CountryService', useClass: MockCountryService },
        { provide: 'StatesService', useClass: MockStatesService },
        { provide: 'CitiesService', useClass: MockCitiesService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
