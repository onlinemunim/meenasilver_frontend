import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysTransactionComponent } from './todays-transaction.component';

describe('TodaysTransactionComponent', () => {
  let component: TodaysTransactionComponent;
  let fixture: ComponentFixture<TodaysTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaysTransactionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodaysTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
