import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RateListGeneratorComponent } from './rate-list-generator.component';
import { provideRouter } from '@angular/router';

describe('RateListGeneratorComponent', () => {
  let component: RateListGeneratorComponent;
  let fixture: ComponentFixture<RateListGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RateListGeneratorComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RateListGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
