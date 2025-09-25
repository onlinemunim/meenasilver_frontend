import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ Import this
import { ToastrModule } from 'ngx-toastr'; // ✅ Import this

import { AddFineStockB2Component } from './add-fine-stock-b2.component';

describe('AddFineStockB2Component', () => {
  let component: AddFineStockB2Component;
  let fixture: ComponentFixture<AddFineStockB2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddFineStockB2Component,
        HttpClientTestingModule,
        BrowserAnimationsModule,   // ✅ Add BrowserAnimationsModule for Toastr animations
        ToastrModule.forRoot()   // ✅ Add ToastrModule to provide ToastrService
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFineStockB2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
