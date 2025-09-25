import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceivedRawMaterialComponent } from './received-raw-material.component';

describe('ReceivedRawMaterialComponent', () => {
  let component: ReceivedRawMaterialComponent;
  let fixture: ComponentFixture<ReceivedRawMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReceivedRawMaterialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReceivedRawMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
