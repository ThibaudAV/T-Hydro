import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualWateringComponent } from './manual-watering.component';

describe('ManualWateringComponent', () => {
  let component: ManualWateringComponent;
  let fixture: ComponentFixture<ManualWateringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManualWateringComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualWateringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
