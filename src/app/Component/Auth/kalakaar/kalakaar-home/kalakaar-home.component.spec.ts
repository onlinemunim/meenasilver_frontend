import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KalakaarHomeComponent } from './kalakaar-home.component';

describe('KalakaarHomeComponent', () => {
  let component: KalakaarHomeComponent;
  let fixture: ComponentFixture<KalakaarHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KalakaarHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KalakaarHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
