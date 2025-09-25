import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneratedRatelistComponent } from './generated-ratelist.component';

describe('GeneratedRatelistComponent', () => {
  let component: GeneratedRatelistComponent;
  let fixture: ComponentFixture<GeneratedRatelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneratedRatelistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneratedRatelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
