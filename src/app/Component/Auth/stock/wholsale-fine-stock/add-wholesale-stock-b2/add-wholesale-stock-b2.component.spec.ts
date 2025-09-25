import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AddWholesaleStockB2Component } from './add-wholesale-stock-b2.component';

describe('AddWholesaleStockB2Component', () => {
  let component: AddWholesaleStockB2Component;
  let fixture: ComponentFixture<AddWholesaleStockB2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // Import the standalone component
        AddWholesaleStockB2Component,

        // Import necessary modules for the testing environment
        HttpClientTestingModule, // ✅ Provides a mock HttpClient for ApiService
        BrowserAnimationsModule,   // ✅ Required for ngx-toastr animations
        ToastrModule.forRoot()   // ✅ Provides ToastrService for NotificationService
      ],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWholesaleStockB2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
