import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlluserListComponent } from './alluser-list.component';
import { provideRouter } from '@angular/router';

describe('AlluserListComponent', () => {
  let component: AlluserListComponent;
  let fixture: ComponentFixture<AlluserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlluserListComponent],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlluserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
