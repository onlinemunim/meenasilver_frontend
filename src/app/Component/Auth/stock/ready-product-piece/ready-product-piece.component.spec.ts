import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyProductPieceComponent } from './ready-product-piece.component';

describe('ReadyProductPieceComponent', () => {
  let component: ReadyProductPieceComponent;
  let fixture: ComponentFixture<ReadyProductPieceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyProductPieceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyProductPieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
