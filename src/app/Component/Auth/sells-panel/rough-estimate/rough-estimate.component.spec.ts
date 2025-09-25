import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoughEstimateComponent } from './rough-estimate.component';

describe('RoughEstimateComponent', () => {
  let component: RoughEstimateComponent;
  let fixture: ComponentFixture<RoughEstimateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoughEstimateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoughEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
