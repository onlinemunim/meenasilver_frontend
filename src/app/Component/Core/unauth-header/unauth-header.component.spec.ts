import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnauthHeaderComponent } from './unauth-header.component';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';

class MockSwiper {
  update = jasmine.createSpy('update');
}

describe('UnauthHeaderComponent', () => {
  let component: UnauthHeaderComponent;
  let fixture: ComponentFixture<UnauthHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnauthHeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthHeaderComponent);
    component = fixture.componentInstance;

    const mockElement = document.createElement('div');
    mockElement.classList.add('swiper-container');
    const wrapper = document.createElement('div');
    wrapper.classList.add('swiper-wrapper');

    for (let i = 0; i < 3; i++) {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      wrapper.appendChild(slide);
    }
    mockElement.appendChild(wrapper);
    document.body.appendChild(mockElement);

    component.swiperRef = new ElementRef(mockElement);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
