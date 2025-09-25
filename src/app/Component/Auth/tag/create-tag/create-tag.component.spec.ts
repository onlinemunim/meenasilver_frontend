import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTagComponent } from './create-tag.component';
import { provideRouter } from '@angular/router';

describe('CreateTagComponent', () => {
  let component: CreateTagComponent;
  let fixture: ComponentFixture<CreateTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTagComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
