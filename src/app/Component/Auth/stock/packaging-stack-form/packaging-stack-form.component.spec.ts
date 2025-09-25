import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingStackFormComponent } from './packaging-stack-form.component';

describe('PackagingStackFormComponent', () => {
  let component: PackagingStackFormComponent;
  let fixture: ComponentFixture<PackagingStackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagingStackFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackagingStackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
