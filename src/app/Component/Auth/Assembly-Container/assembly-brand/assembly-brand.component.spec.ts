import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssemblyBrandComponent } from './assembly-brand.component';

describe('AssemblyBrandComponent', () => {
  let component: AssemblyBrandComponent;
  let fixture: ComponentFixture<AssemblyBrandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssemblyBrandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssemblyBrandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
