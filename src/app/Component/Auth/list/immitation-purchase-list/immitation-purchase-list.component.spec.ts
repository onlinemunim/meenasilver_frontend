import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmitationPurchaseListComponent } from './immitation-purchase-list.component';

describe('ImmitationPurchaseListComponent', () => {
  let component: ImmitationPurchaseListComponent;
  let fixture: ComponentFixture<ImmitationPurchaseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImmitationPurchaseListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImmitationPurchaseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
