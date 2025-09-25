import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KalakaarIncomeComponent } from './kalakaar-income.component';

describe('KalakaarIncomeComponent', () => {
  let component: KalakaarIncomeComponent;
  let fixture: ComponentFixture<KalakaarIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KalakaarIncomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KalakaarIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
