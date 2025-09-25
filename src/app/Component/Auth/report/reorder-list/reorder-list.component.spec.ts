import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderListComponent } from './reorder-list.component';

describe('ReorderListComponent', () => {
  let component: ReorderListComponent;
  let fixture: ComponentFixture<ReorderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReorderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReorderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
