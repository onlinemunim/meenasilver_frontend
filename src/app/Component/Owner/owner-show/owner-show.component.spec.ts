import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { OwnerShowComponent } from './owner-show.component';
import { NgFor } from '@angular/common';
import { RouterLink, provideRouter } from '@angular/router';
import { OwnerService } from '../../../Services/Owner/owner.service';
import { of } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

describe('OwnerShowComponent', () => {
  let component: OwnerShowComponent;
  let fixture: ComponentFixture<OwnerShowComponent>;
  let ownerServiceSpy: jasmine.SpyObj<OwnerService>;
  let ownerService: jasmine.SpyObj<OwnerService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    ownerServiceSpy = jasmine.createSpyObj('OwnerService', ['getOwners']);
    ownerServiceSpy = jasmine.createSpyObj('OwnerService', [
      'getOwners',
      'deleteOwner',
    ]);

    await TestBed.configureTestingModule({
      imports: [OwnerShowComponent, NgFor, RouterLink],
      providers: [
        { provide: OwnerService, useValue: ownerServiceSpy },
        provideHttpClient(),
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OwnerShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getOwners and update owners', () => {
    // Arrange - Mock Data
    const mockOwnersData = {
      data: [
        {
          id: 1,
          fname: 'John',
          lname: 'Doe',
          father_name: 'Robert Doe',
          dob: '1990-05-15',
          sex: 'Male',
          qualification: 'Bachelor’s Degree',
          phone: '1234567890',
          mobile: '9876543210',
          sec_mobile: '8765432109',
          email: 'john.doe@example.com',
          website: 'https://johndoe.com',
          ecomm_website: 'https://shop.johndoe.com',
          since: '2015-06-01',
          ref: 'Referral Code 123',
          last_login: '2024-03-25T10:30:00Z',
          act_period: '2024-01-01 to 2025-01-01',
          act_contact: 'active_contact@example.com',
          otp: '123456',
          other_info: 'Some additional info about John',
          image_id: 101,
          thumb_check: true,
          refferal_code: 'REF12345',
          last_column: 'Some value',
        },
      ],
    };
    ownerServiceSpy.getOwners.and.returnValue(of(mockOwnersData));

    const queryParams = new HttpParams().set('page', '1');

    // Act - Call the function
    component.fetchOwners(queryParams);

    // Assert - Verify getOwners was called and owners were updated
    expect(ownerServiceSpy.getOwners).toHaveBeenCalledWith(queryParams);
    expect(component.owners).toEqual(mockOwnersData.data);
  });

  it('should call fetchOwners with updated queryParams on ngOnInit', () => {
    // Arrange - Mock Dependencies
    const mockParams = { page: '1', sort: 'asc' };
    const mockQueryParams = new HttpParams()
      .set('page', '1')
      .set('sort', 'asc');

    // Mock ActivatedRoute
    const activatedRouteStub = {
      queryParams: of(mockParams),
    };

    // Replace the route with the stub
    component['route'] = activatedRouteStub as any;

    spyOn(component['filterService'], 'updateQueryParams').and.returnValue(
      mockQueryParams
    );
    spyOn(component, 'fetchOwners');

    // Act
    component.ngOnInit();

    // Assert
    expect(component['filterService'].updateQueryParams).toHaveBeenCalledWith(
      mockParams
    );
    expect(component.fetchOwners).toHaveBeenCalledWith(mockQueryParams);
  });
});
