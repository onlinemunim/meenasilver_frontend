import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KalakaarDetailsComponent } from './kalakaar-details.component';

describe('KalakaarDetailsComponent', () => {
  let component: KalakaarDetailsComponent;
  let fixture: ComponentFixture<KalakaarDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KalakaarDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KalakaarDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
