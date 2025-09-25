import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwnerSingleComponent } from './owner-single.component';
import { OwnerService } from '../../../Services/Owner/owner.service';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

describe('OwnerSingleComponent', () => {
  let component: OwnerSingleComponent;
  let fixture: ComponentFixture<OwnerSingleComponent>;
  let ownerServiceSpy: jasmine.SpyObj<OwnerService>;

  beforeEach(async () => {
    // Create a spy for OwnerService with a mock method
    ownerServiceSpy = jasmine.createSpyObj('OwnerService', ['getOwner']);

    // Provide a mock return value for getOwner
    const mockOwnerData ={
      data:{
        id: 1,
        fname: "John",
        lname: "Doe",
        father_name: "Michael Doe",
        dob: "1985-06-15",
        sex: "Male",
        qualification: "MBA",
        phone: "0123456789",
        mobile: "9876543210",
        sec_mobile: "8765432109",
        email: "john.doe@example.com",
        website: "https://johndoe.com",
        ecomm_website: "https://shop.johndoe.com",
        since: "2010-03-25",
        ref: "Referral from friend",
        last_login: "2025-04-15T10:30:00Z",
        act_period: "2025-01-01 to 2025-12-31",
        act_contact: "Support Team",
        otp: "123456",
        other_info: "Owner prefers email contact. Verified user.",
        image_id: 101,
        thumb_check: true,
        refferal_code: "REF2025DOE",
        last_column: "Some optional value"
      },
    };
    ownerServiceSpy.getOwner.and.returnValue(of(mockOwnerData));

    await TestBed.configureTestingModule({
      imports: [OwnerSingleComponent], // Ensure it's properly imported
      providers: [
        { provide: OwnerService, useValue: ownerServiceSpy },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOwner and update owner on ngOnInit', () => {
    // Arrange - Mock Data
    const mockId = 1;
    const mockOwnerData = {
      data:{
        id: 1,
        fname: "John",
        lname: "Doe",
        father_name: "Michael Doe",
        dob: "1985-06-15",
        sex: "Male",
        qualification: "MBA",
        phone: "0123456789",
        mobile: "9876543210",
        sec_mobile: "8765432109",
        email: "john.doe@example.com",
        website: "https://johndoe.com",
        ecomm_website: "https://shop.johndoe.com",
        since: "2010-03-25",
        ref: "Referral from friend",
        last_login: "2025-04-15T10:30:00Z",
        act_period: "2025-01-01 to 2025-12-31",
        act_contact: "Support Team",
        otp: "123456",
        other_info: "Owner prefers email contact. Verified user.",
        image_id: 101,
        thumb_check: true,
        refferal_code: "REF2025DOE",
        last_column: "Some optional value"
      },
    };

    // Mock ActivatedRoute snapshot params
    const activatedRouteStub = {
      snapshot: { params: { id: mockId } },
    };

    // Replace activateroute with the mock
    component['activateroute'] = activatedRouteStub as any;

    // Mock the getOwner method response
    ownerServiceSpy.getOwner.and.returnValue(of(mockOwnerData));

    // Act
    component.ngOnInit();

    // Assert
    expect(ownerServiceSpy.getOwner).toHaveBeenCalledWith(mockId);
    expect(component.owner).toEqual(mockOwnerData.data);
  });
});
