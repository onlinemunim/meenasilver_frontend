import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopsellProductComponent } from './topsell-product.component';

describe('TopsellProductComponent', () => {
  let component: TopsellProductComponent;
  let fixture: ComponentFixture<TopsellProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopsellProductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopsellProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
