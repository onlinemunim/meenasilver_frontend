import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewOnboardComponent } from './new-onboard.component';

describe('NewOnboardComponent', () => {
  let component: NewOnboardComponent;
  let fixture: ComponentFixture<NewOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOnboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
