import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentOrderListComponent } from './recent-order-list.component';

describe('RecentOrderListComponent', () => {
  let component: RecentOrderListComponent;
  let fixture: ComponentFixture<RecentOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
