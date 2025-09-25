import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssembleTaglistComponent } from './assemble-taglist.component';

describe('AssembleTaglistComponent', () => {
  let component: AssembleTaglistComponent;
  let fixture: ComponentFixture<AssembleTaglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssembleTaglistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssembleTaglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
