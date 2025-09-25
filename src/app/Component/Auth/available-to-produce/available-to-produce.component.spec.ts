import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableToProduceComponent } from './available-to-produce.component';

describe('AvailableToProduceComponent', () => {
  let component: AvailableToProduceComponent;
  let fixture: ComponentFixture<AvailableToProduceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableToProduceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableToProduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
