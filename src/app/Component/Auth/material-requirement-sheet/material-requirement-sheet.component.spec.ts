import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialRequirementSheetComponent } from './material-requirement-sheet.component';

describe('MaterialRequirementSheetComponent', () => {
  let component: MaterialRequirementSheetComponent;
  let fixture: ComponentFixture<MaterialRequirementSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialRequirementSheetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaterialRequirementSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
