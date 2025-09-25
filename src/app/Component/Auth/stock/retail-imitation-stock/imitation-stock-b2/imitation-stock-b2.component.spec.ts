import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ImitationStockB2Component } from './imitation-stock-b2.component';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

describe('ImitationStockB2Component', () => {
  let component: ImitationStockB2Component;
  let fixture: ComponentFixture<ImitationStockB2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ImitationStockB2Component,
        HttpClientModule,
        BrowserAnimationsModule, // Required for ngx-toastr animations
        ToastrModule.forRoot() // Provide ToastrService with its configuration
      ],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImitationStockB2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
