import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';  // <-- Import this
import { CustomSelectComponent } from '../../../../Core/custom-select/custom-select.component';
import { StoneFormComponent } from '../../stone-form/stone-form.component';
import { AddSterlingJewelleryStockComponent } from './add-sterling-jewellery-stock.component';
import { ToastrModule } from 'ngx-toastr';


describe('AddSterlingJewelleryStockComponent', () => {
  let component: AddSterlingJewelleryStockComponent;
  let fixture: ComponentFixture<AddSterlingJewelleryStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        RouterLinkActive,
        CustomSelectComponent,
        StoneFormComponent,
        AddSterlingJewelleryStockComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSterlingJewelleryStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a stone form', () => {
    component.addStoneForm();
    expect(component.stoneForms.length).toBe(1);
  });

  it('should remove a stone form', () => {
    component.addStoneForm();
    component.addStoneForm();
    component.removeStoneForm(0);
    expect(component.stoneForms.length).toBe(1);
  });
});
