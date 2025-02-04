import { Routes } from '@angular/router';
import { DaySelectorComponent } from './day-selector/day-selector.component';
import { WateringsComponent } from './waterings/waterings.component';
import { ManualWateringComponent } from './manual-watering/manual-watering.component';
import { ScheduleLogComponent } from './schedule-log/schedule-log.component';
import { DayWateringScheduleComponent } from './day-selector/day-watering-event/day-watering-schedule.component';

export const routes: Routes = [
  {
    path: 'calendar',
    component: DaySelectorComponent,
    children: [
      {
        path: ':date',
        component: DayWateringScheduleComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: new Date().toISOString().split('T')[0],
      },
    ],
  },
  {
    path: 'waterings',
    component: WateringsComponent,
  },
  {
    path: 'manual-watering',
    component: ManualWateringComponent,
  },
  {
    path: 'logs',
    component: ScheduleLogComponent,
  },
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full',
  },
];
