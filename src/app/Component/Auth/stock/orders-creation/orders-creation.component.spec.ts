import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersCreationComponent } from './orders-creation.component';

describe('OrdersCreationComponent', () => {
  let component: OrdersCreationComponent;
  let fixture: ComponentFixture<OrdersCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
