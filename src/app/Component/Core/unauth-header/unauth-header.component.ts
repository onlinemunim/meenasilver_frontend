import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { ThemeService } from '../../../Services/Theme/theme.service';

@Component({
  selector: 'app-unauth-header',
  templateUrl: './unauth-header.component.html',
  styleUrl: './unauth-header.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UnauthHeaderComponent implements AfterViewInit {
  isDarkMode = false; // Initialize as false (light mode by default)

  constructor(private themeService: ThemeService) {}

  @ViewChild('swiper', { static: false }) swiperRef!: ElementRef;
  swiperInstance: Swiper | null = null;

  swiperConfig: any = {
    slidesPerView: 5,
    spaceBetween: 20,  //
    loop: true,
    speed: 500,
    grabCursor: true,
    mousewheel: true,
    freeMode: true,
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 10 },
      992: { slidesPerView: 3, spaceBetween: 15 },
      1200: { slidesPerView: 4, spaceBetween: 20 },
      1400: { slidesPerView: 5, spaceBetween: 20 }
    }
  };

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.swiperRef?.nativeElement instanceof HTMLElement) {
        this.swiperInstance = new Swiper(this.swiperRef.nativeElement, this.swiperConfig);
        this.swiperInstance.update();
      }
    }, 0);

    setTimeout(() => {
      this.isDarkMode = !this.themeService.isDarkMode();
    });
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
    this.isDarkMode = !this.themeService.isDarkMode();
  }
}
