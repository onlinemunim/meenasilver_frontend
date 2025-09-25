import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateReportComponent } from './create-report.component';
import { provideRouter } from '@angular/router';

describe('CreateReportComponent', () => {
  let component: CreateReportComponent;
  let fixture: ComponentFixture<CreateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateReportComponent],
            providers: [
              provideRouter([])
            ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
