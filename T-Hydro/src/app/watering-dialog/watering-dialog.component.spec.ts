import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WateringDialogComponent } from './watering-dialog.component';

describe('WateringDialogComponent', () => {
  let component: WateringDialogComponent;
  let fixture: ComponentFixture<WateringDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WateringDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WateringDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
