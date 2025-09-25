import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMetalEntryComponent } from './raw-metal-entry.component';
import { provideRouter } from '@angular/router';

describe('RawMetalEntryComponent', () => {
  let component: RawMetalEntryComponent;
  let fixture: ComponentFixture<RawMetalEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMetalEntryComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RawMetalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
