import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SinglepackageShowComponent } from './singlepackage-show.component';
import { PackageService } from '../../../Services/Package/package.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';  // Import ToastrModule
import { By } from '@angular/platform-browser';

describe('SinglepackageShowComponent', () => {
  let component: SinglepackageShowComponent;
  let fixture: ComponentFixture<SinglepackageShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        SinglepackageShowComponent
      ],
      providers: [PackageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SinglepackageShowComponent);
    component = fixture.componentInstance;

    // Mocking selectedPackage for the test
    component.selectedPackage = {
      id: 1,
      name: 'Basic Package',
      description: 'A basic package with essential features',
      components: [
        { name: 'Component 1', price: 100 },
        { name: 'Component 2', price: 200 }
      ],
      total_amount: 300,
      min_amount: 50,
      status: 'Active',
      creator_id: 1
    };

    fixture.detectChanges(); // Ensure the component re-renders
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display package details', () => {
    const compiled = fixture.nativeElement;

    // Use querySelector to target the specific elements
    const packageId = compiled.querySelector('p').textContent;
    const packageName = compiled.querySelectorAll('p')[1].textContent;
    const packageDescription = compiled.querySelectorAll('p')[2].textContent;

    // Ensure the content is correctly displayed
    expect(packageId).toContain('1');
    expect(packageName).toContain('Basic Package');
    expect(packageDescription).toContain('A basic package with essential features');
  });
});
