import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTaggingComponent } from './product-tagging.component';

describe('ProductTaggingComponent', () => {
  let component: ProductTaggingComponent;
  let fixture: ComponentFixture<ProductTaggingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTaggingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
