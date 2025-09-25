// // import { ComponentFixture, TestBed } from '@angular/core/testing';

// // import { RightNavbarComponent } from './right-navbar.component';
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { RightNavbarComponent } from './right-navbar.component';
// import { RouterTestingModule } from '@angular/router/testing';

// describe('RightNavbarComponent', () => {
//   let component: RightNavbarComponent;
//   let fixture: ComponentFixture<RightNavbarComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [RightNavbarComponent]
//     })
//     .compileComponents();
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [RightNavbarComponent, RouterTestingModule]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(RightNavbarComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should render correct navbar links', () => {
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement;


//     const navLinks = compiled.querySelectorAll('a');

//     expect(navLinks.length).toBeGreaterThanOrEqual(2);
//     expect(navLinks[0].textContent.trim()).toBe('Firm');
//     expect(navLinks[1].textContent.trim()).toBe('Settings');
//   });


//   it('should apply correct CSS class to the nav element', () => {
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement;

//     const navElement = compiled.querySelector('nav');
//     expect(navElement.classList).toContain('w-24');
//     expect(navElement.classList).toContain('bg-white');
//   });
// });
