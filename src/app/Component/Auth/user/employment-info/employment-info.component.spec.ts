import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentInfoComponent } from './employment-info.component';

describe('EmploymentInfoComponent', () => {
  let component: EmploymentInfoComponent;
  let fixture: ComponentFixture<EmploymentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmploymentInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmploymentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
