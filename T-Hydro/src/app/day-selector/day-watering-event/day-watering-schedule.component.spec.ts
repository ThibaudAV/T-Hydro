import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayWateringScheduleComponent } from './day-watering-schedule.component';

describe('DayWateringEventComponent', () => {
  let component: DayWateringScheduleComponent;
  let fixture: ComponentFixture<DayWateringScheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayWateringScheduleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DayWateringScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
