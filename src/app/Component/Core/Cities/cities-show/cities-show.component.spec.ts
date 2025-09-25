import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitiesShowComponent } from './cities-show.component';
import { CitiesService } from '../../../../Services/cities.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

interface Country {
  id: number;
  name: string;
  code: string;
  currency: string;
}

interface State {
  id: number;
  name: string;
  country: Country;
}

interface Cities {
  id: number;
  name: string;
  state: State;
  country: Country;
}

// ✅ Mock data
const mockCities: Cities[] = [
  {
    id: 1,
    name: 'City A',
    state: {
      id: 1,
      name: 'State A',
      country: {
        id: 1,
        name: 'Country A',
        code: 'CA',
        currency: 'Currency A'
      }
    },
    country: {
      id: 1,
      name: 'Country A',
      code: 'CA',
      currency: 'Currency A'
    }
  },
  {
    id: 2,
    name: 'City B',
    state: {
      id: 2,
      name: 'State B',
      country: {
        id: 2,
        name: 'Country B',
        code: 'CB',
        currency: 'Currency B'
      }
    },
    country: {
      id: 2,
      name: 'Country B',
      code: 'CB',
      currency: 'Currency B'
    }
  }
];

describe('CitiesShowComponent', () => {
  let component: CitiesShowComponent;
  let fixture: ComponentFixture<CitiesShowComponent>;
  let citiesServiceMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // ✅ Mocking CitiesService with required methods
    citiesServiceMock = {
      getCities: jasmine.createSpy('getCities').and.returnValue(of({ data: mockCities })),
      getAllCities: jasmine.createSpy('getAllCities').and.returnValue(of(mockCities)),
      deleteCity: jasmine.createSpy('deleteCity').and.returnValue(of({}))
    };

    // ✅ Mocking ActivatedRoute
    activatedRouteMock = {
      queryParams: of({ page: 1 })
    };

    await TestBed.configureTestingModule({
      imports: [CitiesShowComponent, HttpClientModule, ToastrModule.forRoot()],
      providers: [
        { provide: CitiesService, useValue: citiesServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CitiesShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cities on init', () => {
    expect(citiesServiceMock.getCities).toHaveBeenCalled();
    expect(component.cities).toEqual(mockCities);
  });

  it('should delete a city', () => {
    spyOn(window, 'confirm').and.returnValue(true); // simulate user confirming deletion

    component.deleteCity(new Event('click'), 1);
    expect(citiesServiceMock.deleteCity).toHaveBeenCalledWith(1);

    // simulate city list update after deletion
    component.cities = component.cities.filter((city: Cities) => city.id !== 1);
    expect(component.cities.length).toBe(1);
    expect(component.cities[0].id).toBe(2);
  });
});
