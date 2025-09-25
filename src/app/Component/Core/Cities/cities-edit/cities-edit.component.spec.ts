import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CitiesEditComponent } from './cities-edit.component';
import { CitiesService } from '../../../../Services/cities.service';
import { StatesService } from '../../../../Services/states.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';

describe('CitiesEditComponent', () => {
  let component: CitiesEditComponent;
  let fixture: ComponentFixture<CitiesEditComponent>;
  let mockCitiesService: jasmine.SpyObj<CitiesService>;
  let mockStatesService: jasmine.SpyObj<StatesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockCitiesService = jasmine.createSpyObj('CitiesService', ['getCity', 'updateCity']);
    mockStatesService = jasmine.createSpyObj('StatesService', ['getStates']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        CitiesEditComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: CitiesService, useValue: mockCitiesService },
        { provide: StatesService, useValue: mockStatesService },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CitiesEditComponent);
    component = fixture.componentInstance;

    mockCitiesService.getCity.and.returnValue(of({
      data: {
        name: 'New York',
        state: { id: 2 }
      }
    }));

    mockStatesService.getStates.and.returnValue(of({
      data: [
        { id: 1, name: 'California' },
        { id: 2, name: 'New York State' }
      ]
    }));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call updateCity API and navigate after form submission', () => {
    component.editCityForm.setValue({
      name: 'Los Angeles',
      state_id: 1,
      country_id: 99
    });

    mockCitiesService.updateCity.and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(mockCitiesService.updateCity).toHaveBeenCalledWith('1', {
      name: 'Los Angeles',
      state_id: 1,
      country_id: 99
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/cities']);
  });
});
