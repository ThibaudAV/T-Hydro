import { inject, Injectable } from '@angular/core';
import {
  Config,
  ConfigJson,
  getFullScheduleLog,
  ScheduleLog,
  WateringSchedule,
} from './Config';
import { BehaviorSubject, filter, map, Observable, pipe, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private httpClient = inject(HttpClient);
  private configSubject = new BehaviorSubject<Config | null>(null);
  private configUrl = './config.json'; // URL de la config

  constructor() {}

  public getConfig$(): Observable<Config> {
    if (!this.configSubject.value) {
      return this.loadConfig$();
    }
    return this.configSubject.asObservable().pipe(filter((config) => !!config));
  }

  public refreshConfig$(): Observable<Config> {
    return this.loadConfig$();
  }

  public saveConfig$(config: Config): Observable<Config> {
    // return this.httpClient.put<Config>(this.configUrl, config).pipe(
    //   tap((updatedConfig) => this.configSubject.next(updatedConfig)), // Met à jour le cache après modification
    // );
    this.configSubject.next(config);
    return this.getConfig$();
  }

  public addWateringSchedule(
    wateringSchedule: WateringSchedule,
  ): Observable<Config> {
    const config = this.configSubject.value;
    if (!config) {
      throw new Error('No config loaded');
    }
    return this.saveConfig$({
      ...config,
      wateringSchedules: [...config.wateringSchedules, wateringSchedule],
    });
  }

  public updateWateringSchedule(wateringSchedule: WateringSchedule) {
    const config = this.configSubject.value;
    if (!config) {
      throw new Error('No config loaded');
    }
    const index = config.wateringSchedules.findIndex(
      (ws) => ws._id === wateringSchedule._id,
    );
    if (index === -1) {
      throw new Error('Watering schedule not found');
    }
    config.wateringSchedules[index] = wateringSchedule;
    return this.saveConfig$({
      ...config,
      wateringSchedules: [...config.wateringSchedules],
    });
  }

  public deleteWateringSchedule(wateringScheduleId: string) {
    const config = this.configSubject.value;
    if (!config) {
      throw new Error('No config loaded');
    }
    const index = config.wateringSchedules.findIndex(
      (ws) => ws._id === wateringScheduleId,
    );
    if (index === -1) {
      throw new Error('Watering schedule not found');
    }
    config.wateringSchedules.splice(index, 1);
    return this.saveConfig$({
      ...config,
      wateringSchedules: [...config.wateringSchedules],
    });
  }

  /**
   *
   * DateUnix;Date;Duration;Name
   * 1643700000;2022-02-01 08:00:00;30;1
   * 1643700000;2022-02-01 08:00:00;60;2
   * 1643700000;2022-02-01 08:00:00;120;3
   */
  public buildScheduleLog(): string {
    const config = this.configSubject.value;
    if (!config) {
      throw new Error('No config loaded');
    }

    return (
      getFullScheduleLog(config.wateringSchedules, 30)
        .filter((log) => log.isActive)
        // keep only 10 first logs
        .slice(0, 10)
        .map((log) => `${log.dateUnix};${log.date};${log.duration};${log.name}`)
        .join('\n')
    );
  }

  private loadConfig$(): Observable<Config> {
    return this.httpClient.get<ConfigJson>(this.configUrl).pipe(
      pipe(
        map((configJson) => ({
          ...configJson,
          wateringSchedules: configJson.wateringSchedules.map((ws) => ({
            ...ws,
            _id: Math.random().toString(36).substring(7),
          })),
        })),
        tap((config) => this.configSubject.next(config)), // Met en cache
      ),
    );
  }
}
