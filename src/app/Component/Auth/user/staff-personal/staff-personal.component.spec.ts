import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffPersonalComponent } from './staff-personal.component';

describe('StaffPersonalComponent', () => {
  let component: StaffPersonalComponent;
  let fixture: ComponentFixture<StaffPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
