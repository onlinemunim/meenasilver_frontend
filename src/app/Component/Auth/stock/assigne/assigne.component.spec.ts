import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigneComponent } from './assigne.component';

describe('AssigneComponent', () => {
  let component: AssigneComponent;
  let fixture: ComponentFixture<AssigneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssigneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
