import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AddWholesaleStockB1Component } from './add-wholesale-stock-b1.component';

describe('AddWholesaleStockB1Component', () => {
  let component: AddWholesaleStockB1Component;
  let fixture: ComponentFixture<AddWholesaleStockB1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // The standalone component being tested
        AddWholesaleStockB1Component,

        // Modules required for its dependencies in a test environment
        HttpClientTestingModule, // ✅ Provides a mock HttpClient for ApiService
        BrowserAnimationsModule,   // ✅ Required for ngx-toastr animations
        ToastrModule.forRoot()   // ✅ Provides ToastrService for NotificationService
      ],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWholesaleStockB1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
