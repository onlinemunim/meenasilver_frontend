
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPanelComponent } from './other-panel.component';


describe('OtherPanelComponent', () => {
  let component: OtherPanelComponent;
  let fixture: ComponentFixture<OtherPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
