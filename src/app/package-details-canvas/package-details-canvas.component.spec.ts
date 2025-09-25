import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageDetailsCanvasComponent } from './package-details-canvas.component';

describe('PackageDetailsCanvasComponent', () => {
  let component: PackageDetailsCanvasComponent;
  let fixture: ComponentFixture<PackageDetailsCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackageDetailsCanvasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackageDetailsCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
