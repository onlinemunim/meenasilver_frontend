import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KalakarListComponent } from './kalakar-list.component';

describe('KalakarListComponent', () => {
  let component: KalakarListComponent;
  let fixture: ComponentFixture<KalakarListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KalakarListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KalakarListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
