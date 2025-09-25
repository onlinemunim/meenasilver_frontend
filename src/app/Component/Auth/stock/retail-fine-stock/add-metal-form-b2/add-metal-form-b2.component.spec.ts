import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core'; // ✅ Required

import { AddMetalFormB2Component } from './add-metal-form-b2.component';

describe('AddMetalFormB2Component', () => {
  let component: AddMetalFormB2Component;
  let fixture: ComponentFixture<AddMetalFormB2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddMetalFormB2Component,
        HttpClientTestingModule
      ],
      providers: [
        provideRouter([]),
        importProvidersFrom(ToastrModule.forRoot()) // ✅ Wrap NgModule for standalone
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddMetalFormB2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
