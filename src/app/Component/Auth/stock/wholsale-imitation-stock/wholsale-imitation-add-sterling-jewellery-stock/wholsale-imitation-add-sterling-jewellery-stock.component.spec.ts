import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { WholsaleImitationAddSterlingJewelleryStockComponent } from './wholsale-imitation-add-sterling-jewellery-stock.component';

describe('WholsaleImitationAddSterlingJewelleryStockComponent', () => {
  let component: WholsaleImitationAddSterlingJewelleryStockComponent;
  let fixture: ComponentFixture<WholsaleImitationAddSterlingJewelleryStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // The component itself is already standalone and includes its necessary imports.
      imports: [
        WholsaleImitationAddSterlingJewelleryStockComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule, // Add this for ngx-toastr animations
        ToastrModule.forRoot()   // Add this to provide ToastrService
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WholsaleImitationAddSterlingJewelleryStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a stone form', () => {
    // Arrange: Get the initial number of stone forms
    const initialCount = component.stoneForms.length;

    // Act: Call the method to add a new form
    component.addStoneForm();

    // Assert: Check if the count has increased by 1
    expect(component.stoneForms.length).toBe(initialCount + 1);
  });

  it('should remove a stone form', () => {
    // Arrange: Add two forms to start with
    component.addStoneForm();
    component.addStoneForm();
    const initialCount = component.stoneForms.length; // Should be 2

    // Act: Remove the first form (at index 0)
    component.removeStoneForm(0);

    // Assert: Check if the count has decreased by 1
    expect(component.stoneForms.length).toBe(initialCount - 1);
  });
});
