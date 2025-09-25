import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmitationSterlingJewelleryPanelListComponent } from './immitation-sterling-jewellery-panel-list.component';

describe('ImmitationSterlingJewelleryPanelListComponent', () => {
  let component: ImmitationSterlingJewelleryPanelListComponent;
  let fixture: ComponentFixture<ImmitationSterlingJewelleryPanelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmitationSterlingJewelleryPanelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmitationSterlingJewelleryPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
