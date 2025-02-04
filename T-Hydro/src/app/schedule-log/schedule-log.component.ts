import { Component, inject } from '@angular/core';
import { ConfigService } from '../../service/config.service';

@Component({
  selector: 'app-schedule-log',
  imports: [],
  templateUrl: './schedule-log.component.html',
  styleUrl: './schedule-log.component.scss',
})
export class ScheduleLogComponent {
  private configService = inject(ConfigService);

  public scheduleLogsString = this.configService.buildScheduleLog();
}
