import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMetalListComponent } from './raw-metal-list.component';

describe('RawMetalListComponent', () => {
  let component: RawMetalListComponent;
  let fixture: ComponentFixture<RawMetalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMetalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMetalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
