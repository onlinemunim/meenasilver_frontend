import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTargetAnalysisComponent } from './sales-target-analysis.component';

describe('SalesTargetAnalysisComponent', () => {
  let component: SalesTargetAnalysisComponent;
  let fixture: ComponentFixture<SalesTargetAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesTargetAnalysisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesTargetAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
