import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { of } from 'rxjs';

import { RawStoneListComponent } from './raw-stone-list.component';

describe('RawStoneListComponent', () => {
  let component: RawStoneListComponent;
  let fixture: ComponentFixture<RawStoneListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RawStoneListComponent,     // Standalone component
        HttpClientTestingModule,   // Mocks HttpClient
        ToastrModule.forRoot()     // <-- Fixes the ToastConfig injection error
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
            queryParams: of({}),
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null)
              },
              data: {}
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RawStoneListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
