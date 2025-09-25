import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { StatesShowComponent } from './states-show.component';
import { StatesService } from '../../../../Services/states.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
const mockStatesService = {
  getAllStates: jasmine.createSpy().and.returnValue(of([])),
  deleteState: jasmine.createSpy().and.returnValue(of({ success: true })),
};

describe('StatesShowComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StatesShowComponent, // assuming this is a standalone component
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: StatesService, useValue: mockStatesService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 1 }),
            snapshot: { paramMap: { get: (key: string) => '1' } }
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(StatesShowComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
