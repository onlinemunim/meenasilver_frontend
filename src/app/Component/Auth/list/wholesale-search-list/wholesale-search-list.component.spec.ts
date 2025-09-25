import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholesaleSearchListComponent } from './wholesale-search-list.component';

describe('WholesaleSearchListComponent', () => {
  let component: WholesaleSearchListComponent;
  let fixture: ComponentFixture<WholesaleSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WholesaleSearchListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WholesaleSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
