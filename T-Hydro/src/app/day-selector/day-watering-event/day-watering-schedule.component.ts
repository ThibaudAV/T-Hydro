import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
} from '@angular/core';
import {
  getScheduleLogForDay,
  ScheduleLog,
  WateringSchedule,
} from '../../../service/Config';
import { DatePipe, NgIf } from '@angular/common';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { WateringDialogComponent } from '../../watering-dialog/watering-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfigService } from '../../../service/config.service';
import { Badge } from 'primeng/badge';
import { TabPanels } from 'primeng/tabs';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { ProgressSpinner } from 'primeng/progressspinner';

export type ScheduleVM = {
  startTime: Date;
  durationWatering: number;
  name: string;
  outputId: number;
  isPast: boolean;
  isActive: boolean;
  menuItems: MenuItem[];
};

@Component({
  selector: 'app-day-watering-schedule',
  imports: [DatePipe, NgIf, Button, TableModule, Menu, Badge],
  templateUrl: './day-watering-schedule.component.html',
  styleUrl: './day-watering-schedule.component.scss',
})
export class DayWateringScheduleComponent implements OnInit {
  private dialogService = inject(DialogService);
  private configService = inject(ConfigService);
  private activatedRoute = inject(ActivatedRoute);

  wateringSchedule: ScheduleVM[] = [];

  loading = signal(true);

  ngOnInit(): void {
    combineLatest([this.activatedRoute.params, this.configService.getConfig$()])
      .pipe()
      .subscribe(([params, config]) => {
        this.loading.update(() => true);
        this.init(
          getScheduleLogForDay(
            config.wateringSchedules,
            new Date(params['date']),
          ),
        );
        this.loading.update(() => false);
      });
  }

  init(scheduleLogs: ScheduleLog[]): void {
    if (!scheduleLogs) return;

    this.wateringSchedule = scheduleLogs.map((watering) => {
      const date = new Date(watering.dateUnix * 1000);

      const isPast = date < new Date();
      return {
        startTime: date,
        durationWatering: watering.duration,
        name: watering.name,
        outputId: watering._parentWatering.outputId,
        isActive: watering.isActive,
        isPast,
        menuItems: this.getScheduleMenuItems(watering._parentWatering, isPast),
      };
    });
  }

  getScheduleMenuItems(
    watering: WateringSchedule,
    isPast: boolean,
  ): MenuItem[] {
    const items = [
      {
        label: "Modifier le programme d'arrosage",
        icon: 'pi pi-cog',
        command: this.openWateringDialog.bind(this, watering),
      },
    ];
    if (!isPast) {
      items.push(
        watering.isActive
          ? {
              label: 'Mettre en pause',
              icon: 'pi pi-pause',
              command: this.pauseWatering.bind(this, watering),
            }
          : {
              label: 'Reprendre',
              icon: 'pi pi-play',
              command: this.playWatering.bind(this, watering),
            },
      );
    }
    return items;
  }

  openWateringDialog(watering: WateringSchedule) {
    this.dialogService.open(WateringDialogComponent, {
      header: "Modifier le programme d'arrosage",
      width: '70%',
      baseZIndex: 10000,
      modal: true,
      closable: true,
      data: { ...watering },
    });
  }

  pauseWatering(watering: WateringSchedule) {
    this.configService
      .updateWateringSchedule({
        ...watering,
        isActive: false,
      })
      .subscribe();
  }

  playWatering(watering: WateringSchedule) {
    this.configService
      .updateWateringSchedule({
        ...watering,
        isActive: true,
      })
      .subscribe();
  }
}
