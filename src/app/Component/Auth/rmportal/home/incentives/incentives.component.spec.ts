import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentivesComponent } from './incentives.component';

describe('IncentivesComponent', () => {
  let component: IncentivesComponent;
  let fixture: ComponentFixture<IncentivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncentivesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
