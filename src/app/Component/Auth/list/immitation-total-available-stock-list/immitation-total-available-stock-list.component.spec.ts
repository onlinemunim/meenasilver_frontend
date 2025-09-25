import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmitationTotalAvailableStockListComponent } from './immitation-total-available-stock-list.component';

describe('ImmitationTotalAvailableStockListComponent', () => {
  let component: ImmitationTotalAvailableStockListComponent;
  let fixture: ComponentFixture<ImmitationTotalAvailableStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmitationTotalAvailableStockListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmitationTotalAvailableStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
