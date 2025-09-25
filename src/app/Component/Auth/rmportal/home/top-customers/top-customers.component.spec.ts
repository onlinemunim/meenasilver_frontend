import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCustomersComponent } from './top-customers.component';

describe('TopCustomersComponent', () => {
  let component: TopCustomersComponent;
  let fixture: ComponentFixture<TopCustomersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopCustomersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
