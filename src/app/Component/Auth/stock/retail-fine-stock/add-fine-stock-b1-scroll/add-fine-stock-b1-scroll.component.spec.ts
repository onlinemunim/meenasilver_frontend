import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { AddFineStockB1ScrollComponent } from './add-fine-stock-b1-scroll.component';

describe('AddFineStockB1ScrollComponent', () => {
  let component: AddFineStockB1ScrollComponent;
  let fixture: ComponentFixture<AddFineStockB1ScrollComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddFineStockB1ScrollComponent,
        HttpClientTestingModule,
        BrowserAnimationsModule,   // ✅ Add BrowserAnimationsModule for Toastr animations
        ToastrModule.forRoot()   // ✅ Add ToastrModule to provide ToastrService and its config
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFineStockB1ScrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
