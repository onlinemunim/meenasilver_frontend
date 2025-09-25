import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ToastrModule, ToastrService } from 'ngx-toastr';

import { StatesEditComponent } from './states-edit.component';
import { StatesService } from '../../../../Services/states.service';

describe('StatesEditComponent', () => {
  let component: StatesEditComponent;
  let fixture: ComponentFixture<StatesEditComponent>;
  let mockStatesService: jasmine.SpyObj<StatesService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockStatesService = jasmine.createSpyObj('StatesService', ['getState', 'updateState']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockToastr = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [StatesEditComponent, ReactiveFormsModule, ToastrModule.forRoot()],
      providers: [
        { provide: StatesService, useValue: mockStatesService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastrService, useValue: mockToastr },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '1' : null)
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatesEditComponent);
    component = fixture.componentInstance;

    mockStatesService.getState.and.returnValue(of({ data: { name: 'California', country_id: 101 } }));

    fixture.detectChanges(); // triggers ngOnInit
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with fetched state data', () => {
    expect(component.editStateForm.value).toEqual({
      name: 'California',
      country_id: 101
    });
  });

  it('should call updateState API and navigate on form submission', () => {
    component.editStateForm.setValue({ name: 'Texas', country_id: 102 });

    mockStatesService.updateState.and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(mockStatesService.updateState).toHaveBeenCalledWith(1, {
      name: 'Texas',
      country_id: 102
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/states']);
  });

  it('should not call updateState if form is invalid', () => {
    component.editStateForm.setValue({ name: '', country_id: '' }); // invalid

    component.onSubmit();

    expect(mockStatesService.updateState).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
