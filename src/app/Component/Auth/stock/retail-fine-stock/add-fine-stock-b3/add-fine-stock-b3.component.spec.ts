import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AddFineStockB3Component } from './add-fine-stock-b3.component';

describe('AddFineStockB3Component', () => {
  // The type annotation for 'component' is now corrected.
  let component: AddFineStockB3Component;
  let fixture: ComponentFixture<AddFineStockB3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddFineStockB3Component,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFineStockB3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
