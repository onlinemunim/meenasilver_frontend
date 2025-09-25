import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineProductComponent } from './fine-product.component';

describe('FineProductComponent', () => {
  let component: FineProductComponent;
  let fixture: ComponentFixture<FineProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FineProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
