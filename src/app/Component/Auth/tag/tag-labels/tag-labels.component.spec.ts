import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TagLabelsComponent } from './tag-labels.component';

describe('TagLabelsComponent', () => {
  let component: TagLabelsComponent;
  let fixture: ComponentFixture<TagLabelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TagLabelsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TagLabelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
