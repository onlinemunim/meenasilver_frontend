import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyContainerComponent } from './assembly-container.component';

describe('AssemblyContainerComponent', () => {
  let component: AssemblyContainerComponent;
  let fixture: ComponentFixture<AssemblyContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssemblyContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
