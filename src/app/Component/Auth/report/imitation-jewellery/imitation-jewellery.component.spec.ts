import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImitationJewelleryComponent } from './imitation-jewellery.component';

describe('ImitationJewelleryComponent', () => {
  let component: ImitationJewelleryComponent;
  let fixture: ComponentFixture<ImitationJewelleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImitationJewelleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImitationJewelleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
