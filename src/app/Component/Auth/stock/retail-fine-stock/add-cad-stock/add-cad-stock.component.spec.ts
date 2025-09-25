import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

import { AddCadStockComponent } from './add-cad-stock.component';

describe('AddCadStockComponent', () => {
  let component: AddCadStockComponent;
  let fixture: ComponentFixture<AddCadStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddCadStockComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        provideRouter([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddCadStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
