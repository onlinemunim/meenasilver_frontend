import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpParams } from '@angular/common/http';
import { CountryShowComponent } from './country-show.component';
import { CountryService } from '../../../../Services/country.service';
import { FilterService } from '../../../../Services/filter.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

interface Country {
  id: number;
  name: string;
  code: string;
  currency: string;
}

const mockCountries: Country[] = [
  { id: 1, name: 'Country A', code: 'CA', currency: 'Currency A' },
  { id: 2, name: 'Country B', code: 'CB', currency: 'Currency B' }
];

describe('CountryShowComponent', () => {
  let component: CountryShowComponent;
  let fixture: ComponentFixture<CountryShowComponent>;
  let mockCountryService: jasmine.SpyObj<CountryService>;
  let mockFilterService: jasmine.SpyObj<FilterService>;

  beforeEach(async () => {
    mockCountryService = jasmine.createSpyObj('CountryService', ['getCountries', 'deleteCountry']);
    mockFilterService = jasmine.createSpyObj('FilterService', ['updateQueryParams']);

    await TestBed.configureTestingModule({
      imports: [HttpClientModule, ToastrModule.forRoot(), CountryShowComponent],
      providers: [
        { provide: CountryService, useValue: mockCountryService },
        { provide: FilterService, useValue: mockFilterService },
        ToastrService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ page: 1 }) // 👈 Mocking queryParams observable
          }
        }
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    // Mocking the FilterService output (returns HttpParams)
    mockFilterService.updateQueryParams.and.returnValue(new HttpParams());

    // Mocking CountryService methods
    mockCountryService.getCountries.and.returnValue(of({ data: mockCountries }));
    mockCountryService.deleteCountry.and.returnValue(of({ success: true }));

    fixture = TestBed.createComponent(CountryShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch countries on init', () => {
    expect(mockCountryService.getCountries).toHaveBeenCalled();
    expect(component.countries).toEqual(mockCountries);
  });

  it('should delete a country', () => {
    spyOn(window, 'confirm').and.returnValue(true);

    component.countries = [...mockCountries];
    component.deleteCountry(new Event('click'), 1);

    expect(mockCountryService.deleteCountry).toHaveBeenCalledWith(1);
    expect(component.countries.length).toBe(1);
    expect(component.countries.find((country: Country) => country.id === 1)).toBeUndefined();
  });
});
