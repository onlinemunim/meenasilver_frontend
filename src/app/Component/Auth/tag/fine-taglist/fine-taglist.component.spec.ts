import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FineTaglistComponent } from './fine-taglist.component';

describe('FineTaglistComponent', () => {
  let component: FineTaglistComponent;
  let fixture: ComponentFixture<FineTaglistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FineTaglistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FineTaglistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
