import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmitationWholesaleSearchImagesComponent } from './immitation-wholesale-search-images.component';

describe('ImmitationWholesaleSearchImagesComponent', () => {
  let component: ImmitationWholesaleSearchImagesComponent;
  let fixture: ComponentFixture<ImmitationWholesaleSearchImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmitationWholesaleSearchImagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmitationWholesaleSearchImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
