import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // ✅ Import for services
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Import this
import { ToastrModule } from 'ngx-toastr'; // ✅ Import this

import { WholsaleImitationStockB2Component } from './wholsale-imitation-stock-b2.component';

describe('WholsaleImitationStockB2Component', () => {
  let component: WholsaleImitationStockB2Component;
  let fixture: ComponentFixture<WholsaleImitationStockB2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        WholsaleImitationStockB2Component,
        HttpClientTestingModule, // ✅ Add for HttpClient dependency
        BrowserAnimationsModule,   // ✅ Add this for Toastr animations
        ToastrModule.forRoot()   // ✅ Add this to provide ToastrService
      ],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WholsaleImitationStockB2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
