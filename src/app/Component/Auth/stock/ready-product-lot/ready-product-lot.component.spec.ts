import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyProductLotComponent } from './ready-product-lot.component';

describe('ReadyProductLotComponent', () => {
  let component: ReadyProductLotComponent;
  let fixture: ComponentFixture<ReadyProductLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyProductLotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyProductLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
