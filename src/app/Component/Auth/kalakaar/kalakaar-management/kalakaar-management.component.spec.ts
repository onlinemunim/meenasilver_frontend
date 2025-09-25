import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KalakaarManagementComponent } from './kalakaar-management.component';

describe('KalakaarManagementComponent', () => {
  let component: KalakaarManagementComponent;
  let fixture: ComponentFixture<KalakaarManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KalakaarManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KalakaarManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
