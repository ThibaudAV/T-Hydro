import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleLogComponent } from './schedule-log.component';

describe('ScheduleLogComponent', () => {
  let component: ScheduleLogComponent;
  let fixture: ComponentFixture<ScheduleLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
