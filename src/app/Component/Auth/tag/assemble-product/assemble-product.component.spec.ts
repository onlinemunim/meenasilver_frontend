import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssembleProductComponent } from './assemble-product.component';

describe('AssembleProductComponent', () => {
  let component: AssembleProductComponent;
  let fixture: ComponentFixture<AssembleProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssembleProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssembleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
