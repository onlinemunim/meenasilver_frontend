import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellDetailsPanelComponent } from './sell-details-panel.component';

describe('SellDetailsPanelComponent', () => {
  let component: SellDetailsPanelComponent;
  let fixture: ComponentFixture<SellDetailsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SellDetailsPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellDetailsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
