import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestorPersonalComponent } from './investor-personal.component';

describe('InvestorPersonalComponent', () => {
  let component: InvestorPersonalComponent;
  let fixture: ComponentFixture<InvestorPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestorPersonalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestorPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
