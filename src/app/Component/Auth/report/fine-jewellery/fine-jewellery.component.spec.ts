import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineJewelleryComponent } from './fine-jewellery.component';

describe('FineJewelleryComponent', () => {
  let component: FineJewelleryComponent;
  let fixture: ComponentFixture<FineJewelleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FineJewelleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineJewelleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
