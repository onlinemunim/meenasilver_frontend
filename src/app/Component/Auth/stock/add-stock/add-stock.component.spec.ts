import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStockComponent } from './add-stock.component';
import { provideRouter } from '@angular/router';

describe('AddStockComponent', () => {
  let component: AddStockComponent;
  let fixture: ComponentFixture<AddStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStockComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
