import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { ImitationStockB1Component } from './imitation-stock-b1.component';

describe('ImitationStockB1Component', () => {
  let component: ImitationStockB1Component;
  let fixture: ComponentFixture<ImitationStockB1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Import the standalone component
        ImitationStockB1Component,

        // Import modules required for the testing environment
        HttpClientTestingModule, // ✅ Provides a mock HttpClient
        BrowserAnimationsModule,   // Required for Toastr animations
        ToastrModule.forRoot()   // Provides ToastrService for NotificationService
      ],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImitationStockB1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
