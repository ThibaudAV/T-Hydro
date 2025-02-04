import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { Menu } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { Config, WateringSchedule } from '../../service/Config';
import { Chip } from 'primeng/chip';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { WateringDialogComponent } from '../watering-dialog/watering-dialog.component';
import { DialogService } from 'primeng/dynamicdialog';
import { Badge } from 'primeng/badge';
import { map, Observable, tap } from 'rxjs';
import { ConfigService } from '../../service/config.service';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';

type WateringVM = {
  frequencyReadable: string;
  durationReadable: string;
  menuItems: MenuItem[];
} & WateringSchedule;

@Component({
  selector: 'app-waterings',
  imports: [
    Button,
    DatePipe,
    Menu,
    NgIf,
    TableModule,
    Chip,
    Badge,
    AsyncPipe,
    ConfirmDialog,
  ],
  providers: [ConfirmationService],
  templateUrl: './waterings.component.html',
  styleUrl: './waterings.component.scss',
})
export class WateringsComponent {
  private configService = inject(ConfigService);
  private confirmationService = inject(ConfirmationService);

  wateringTimes$: Observable<WateringVM[]> = this.configService
    .getConfig$()
    .pipe(
      map((config) =>
        [
          ...config.wateringSchedules,
          ...config.wateringSchedules,
          ...config.wateringSchedules,
          ...config.wateringSchedules,
        ]?.map((watering) => ({
          ...watering,
          frequencyReadable: this.getFrequencyMinutesReadable(
            watering.frequencyMinutes,
          ),
          durationReadable: this.getDurationMinutesReadable(
            watering.durationMinutes,
          ),
          menuItems: this.getScheduleMenuItems(watering),
        })),
      ),
    );

  constructor(private dialogService: DialogService) {}

  getFrequencyMinutesReadable(frequency: number): string {
    if (frequency < 60) {
      const minutesString = String(frequency).padStart(2, '0');
      return `${minutesString}m`;
    }
    if (frequency < 60 * 24) {
      const hours = Math.floor(frequency / 60);
      const minutes = frequency % 60;
      const hoursString = String(hours).padStart(2, '0');
      const minutesString = String(minutes).padStart(2, '0');
      if (minutes === 0) {
        return `${hours}h`;
      }
      return `${hoursString}h${minutesString}m`;
    }
    const days = Math.floor(frequency / (60 * 24));
    const hours = Math.floor((frequency % (60 * 24)) / 60);
    const minutes = frequency % 60;

    const hoursString = String(hours).padStart(2, '0');
    const minutesString = String(minutes).padStart(2, '0');

    if (hours === 0 && minutes === 0) {
      return `${days}j`;
    } else if (hours === 0) {
      return `${days}j${minutesString}m`;
    } else if (minutes === 0) {
      return `${days}j${hoursString}h`;
    } else {
      return `${days}j${hoursString}h${minutesString}m`;
    }
  }

  getDurationMinutesReadable(duration: number): string {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    const hoursString = String(hours).padStart(2, '0');
    const minutesString = String(minutes).padStart(2, '0');

    if (hours === 0) {
      return `${minutesString}m`;
    } else if (minutes === 0) {
      return `${hoursString}h`;
    }
    return `${hoursString}h${minutesString}m`;
  }

  getScheduleMenuItems(watering: WateringSchedule): MenuItem[] {
    return [
      {
        label: "Modifier le programme d'arrosage",
        icon: 'pi pi-cog',
        command: this.openWateringDialog.bind(this, watering),
      },
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
      {
        label: 'Supprimer',
        icon: 'pi pi-trash',
        command: this.deleteWatering.bind(this, watering),
      },
    ];
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

  deleteWatering(watering: WateringSchedule) {
    this.confirmationService.confirm({
      header: 'Supprimer',
      message: "Êtes-vous sûr de vouloir supprimer ce programme d'arrosage ?",
      acceptButtonProps: { label: 'Oui' },
      rejectButtonProps: { label: 'Non' },
      accept: () => {
        this.configService.deleteWateringSchedule(watering._id).subscribe();
      },
    });
  }
}
