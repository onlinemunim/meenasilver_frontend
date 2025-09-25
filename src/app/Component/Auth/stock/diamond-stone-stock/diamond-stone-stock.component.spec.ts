

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondStoneStockComponent } from './diamond-stone-stock.component';

import { provideRouter } from '@angular/router';


describe('DiamondStoneStockComponent', () => {
  let component: DiamondStoneStockComponent;
  let fixture: ComponentFixture<DiamondStoneStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiamondStoneStockComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiamondStoneStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
