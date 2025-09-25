import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleUnauthComponent } from './simple-unauth.component';

describe('SimpleUnauthComponent', () => {
  let component: SimpleUnauthComponent;
  let fixture: ComponentFixture<SimpleUnauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleUnauthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpleUnauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
