import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // ✅ Import this
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Import for Toastr
import { ToastrModule } from 'ngx-toastr'; // ✅ Import for Toastr

import { WholsaleImitationStockB1Component } from './wholsale-imitation-stock-b1.component';

describe('WholsaleImitationStockB1Component', () => {
  let component: WholsaleImitationStockB1Component;
  let fixture: ComponentFixture<WholsaleImitationStockB1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WholsaleImitationStockB1Component,
        HttpClientTestingModule, // ✅ Add this to provide HttpClient
        BrowserAnimationsModule,   // ✅ Add this for NotificationService
        ToastrModule.forRoot()   // ✅ Add this for NotificationService
      ],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WholsaleImitationStockB1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
