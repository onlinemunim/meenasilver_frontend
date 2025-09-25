import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { ImitationFashionJewelleryComponent } from './imitation-fashion-jewellery.component';

describe('ImitationFashionJewelleryComponent', () => {
  let component: ImitationFashionJewelleryComponent;
  let fixture: ComponentFixture<ImitationFashionJewelleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Import the standalone component directly
        ImitationFashionJewelleryComponent,

        // Import necessary modules for testing environment
        HttpClientTestingModule,
        BrowserAnimationsModule, // Required for ngx-toastr animations
        ToastrModule.forRoot()   // Provides ToastrService and its config
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ImitationFashionJewelleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a stone form', () => {
    // Arrange
    const initialCount = component.stoneForms.length;

    // Act
    component.addStoneForm();

    // Assert
    expect(component.stoneForms.length).toBe(initialCount + 1);
  });

  it('should remove a stone form', () => {
    // Arrange: Add a couple of forms to ensure there's something to remove
    component.addStoneForm();
    component.addStoneForm();
    const initialCount = component.stoneForms.length;

    // Act: Remove the first form
    component.removeStoneForm(0);

    // Assert
    expect(component.stoneForms.length).toBe(initialCount - 1);
  });
});
