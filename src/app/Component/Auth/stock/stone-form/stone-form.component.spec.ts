import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneFormComponent } from './stone-form.component';

describe('StoneFormComponent', () => {
  let component: StoneFormComponent;
  let fixture: ComponentFixture<StoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoneFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
