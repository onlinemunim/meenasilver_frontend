import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmitationSterlingJewelleryPanelImageComponent } from './immitation-sterling-jewellery-panel-image.component';

describe('ImmitationSterlingJewelleryPanelImageComponent', () => {
  let component: ImmitationSterlingJewelleryPanelImageComponent;
  let fixture: ComponentFixture<ImmitationSterlingJewelleryPanelImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmitationSterlingJewelleryPanelImageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmitationSterlingJewelleryPanelImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
