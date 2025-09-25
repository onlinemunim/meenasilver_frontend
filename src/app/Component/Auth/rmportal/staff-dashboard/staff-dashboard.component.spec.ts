import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffDashboardComponent } from './staff-dashboard.component';
import { provideRouter } from '@angular/router';

describe('StaffDashboardComponent', () => {
  let component: StaffDashboardComponent;
  let fixture: ComponentFixture<StaffDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffDashboardComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
