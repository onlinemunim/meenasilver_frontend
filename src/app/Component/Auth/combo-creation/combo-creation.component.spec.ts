import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboCreationComponent } from './combo-creation.component';

describe('ComboCreationComponent', () => {
  let component: ComboCreationComponent;
  let fixture: ComponentFixture<ComboCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComboCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
