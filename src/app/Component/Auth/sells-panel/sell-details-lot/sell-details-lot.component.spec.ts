import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellDetailsLotComponent } from './sell-details-lot.component';

describe('SellDetailsLotComponent', () => {
  let component: SellDetailsLotComponent;
  let fixture: ComponentFixture<SellDetailsLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellDetailsLotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellDetailsLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
