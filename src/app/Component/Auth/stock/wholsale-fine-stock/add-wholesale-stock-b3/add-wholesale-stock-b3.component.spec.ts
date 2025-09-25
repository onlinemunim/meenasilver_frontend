import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AddWholesaleStockB3Component } from './add-wholesale-stock-b3.component';

describe('AddWholesaleStockB3Component', () => {
  let component: AddWholesaleStockB3Component;
  let fixture: ComponentFixture<AddWholesaleStockB3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // For standalone components, they must go into the 'imports' array.
      // There should NOT be a 'declarations' array here for this component.
      imports: [
        AddWholesaleStockB3Component,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot()
      ],
      providers: [
        provideRouter([])
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWholesaleStockB3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
