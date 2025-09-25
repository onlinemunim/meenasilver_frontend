import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarEmployeeComponent } from './star-employee.component';

describe('StarEmployeeComponent', () => {
  let component: StarEmployeeComponent;
  let fixture: ComponentFixture<StarEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarEmployeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
