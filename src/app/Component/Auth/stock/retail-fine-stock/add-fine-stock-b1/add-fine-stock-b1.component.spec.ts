import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddFineStockB1Component } from './add-fine-stock-b1.component';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('AddFineStockB1Component', () => {
  let component: AddFineStockB1Component;
  let fixture: ComponentFixture<AddFineStockB1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddFineStockB1Component,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(AddFineStockB1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
