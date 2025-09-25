import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTaggingListComponent } from './product-tagging-list.component';

describe('ProductTaggingListComponent', () => {
  let component: ProductTaggingListComponent;
  let fixture: ComponentFixture<ProductTaggingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTaggingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductTaggingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
