import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmitationRetailStockListComponent } from './immitation-retail-stock-list.component';

describe('ImmitationRetailStockListComponent', () => {
  let component: ImmitationRetailStockListComponent;
  let fixture: ComponentFixture<ImmitationRetailStockListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmitationRetailStockListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmitationRetailStockListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
