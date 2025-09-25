import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RawMetalStockComponent } from './raw-metal-stock.component';

describe('RawMetalStockComponent', () => {
  let component: RawMetalStockComponent;
  let fixture: ComponentFixture<RawMetalStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RawMetalStockComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(RawMetalStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind and update all selections correctly', () => {
    component.selectedMetal = 'Copper';
    component.selectedItem = 'Category 2';
    component.selectedUnit = 'Ton';
    component.selectedFirm = 'Firm B';
    component.selectedBrandseller = 'Brand Y';
    fixture.detectChanges();

    expect(component.selectedMetal).toBe('Copper');
    expect(component.selectedItem).toBe('Category 2');
    expect(component.selectedUnit).toBe('Ton');
    expect(component.selectedFirm).toBe('Firm B');
    expect(component.selectedBrandseller).toBe('Brand Y');
  });
});




// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { RawMetalStockComponent } from './raw-metal-stock.component';
// import { FormsModule } from '@angular/forms';

// describe('RawMetalStockComponent', () => {
//   let component: RawMetalStockComponent;
//   let fixture: ComponentFixture<RawMetalStockComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       declarations: [RawMetalStockComponent],
//       imports: [FormsModule]
//     }).compileComponents();

//     fixture = TestBed.createComponent(RawMetalStockComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

