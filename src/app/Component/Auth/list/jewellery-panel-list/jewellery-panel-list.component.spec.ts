import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryPanelListComponent } from './jewellery-panel-list.component';

describe('JewelleryPanelListComponent', () => {
  let component: JewelleryPanelListComponent;
  let fixture: ComponentFixture<JewelleryPanelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JewelleryPanelListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JewelleryPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
