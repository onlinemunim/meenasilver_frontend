import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmEditParentComponent } from './firm-edit-parent.component';

describe('FirmEditParentComponent', () => {
  let component: FirmEditParentComponent;
  let fixture: ComponentFixture<FirmEditParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmEditParentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmEditParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
