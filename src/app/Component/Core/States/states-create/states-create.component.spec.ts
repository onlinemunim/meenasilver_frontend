import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatesCreateComponent } from './states-create.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { StatesService } from '../../../../Services/states.service';

describe('StatesCreateComponent', () => {
  let component: StatesCreateComponent;
  let fixture: ComponentFixture<StatesCreateComponent>;
  let mockStateService: jasmine.SpyObj<StatesService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockStateService = jasmine.createSpyObj('StateService', ['createState']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        StatesCreateComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: StatesService, useValue: mockStateService },
        { provide: Router, useValue: mockRouter },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.createStateForm.value).toEqual({ name: '',country_id: '' });
  });

  it('should call createState API on form submission', () => {
    component.createStateForm.setValue({
      name: 'California',
      country_id: '1'
    });

    mockStateService.createState.and.returnValue(of({ success: true }));

    component.onSubmit();

    expect(mockStateService.createState).toHaveBeenCalledWith({
      name: 'California',
      country_id: '1'
    });

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/states']);
  });
});
