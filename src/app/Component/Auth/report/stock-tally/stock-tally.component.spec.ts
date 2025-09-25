

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTallyComponent } from './stock-tally.component';


describe('StockTallyComponent', () => {
  let component: StockTallyComponent;
  let fixture: ComponentFixture<StockTallyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockTallyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StockTallyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
