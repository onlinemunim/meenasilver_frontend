import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMetalComponent } from './raw-metal.component';

describe('RawMetalComponent', () => {
  let component: RawMetalComponent;
  let fixture: ComponentFixture<RawMetalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMetalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMetalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
