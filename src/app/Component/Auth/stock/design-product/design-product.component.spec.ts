import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignProductComponent } from './design-product.component';

describe('DesignProductComponent', () => {
  let component: DesignProductComponent;
  let fixture: ComponentFixture<DesignProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
