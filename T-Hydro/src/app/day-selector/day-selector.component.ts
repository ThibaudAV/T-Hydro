import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Tab, TabList, TabPanel, TabPanels, Tabs } from 'primeng/tabs';
import { Badge } from 'primeng/badge';
import { DayWateringScheduleComponent } from './day-watering-event/day-watering-schedule.component';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  map,
  startWith,
  Subject,
  tap,
} from 'rxjs';
import {
  getScheduleLogForDay,
  ScheduleLog,
  WateringSchedule,
} from '../../service/Config';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ConfigService } from '../../service/config.service';

type DayVM = { name: string; number: number; date: Date };

@Component({
  selector: 'app-day-selector',
  imports: [
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    Badge,
    DayWateringScheduleComponent,
    AsyncPipe,
    DatePipe,
    RouterOutlet,
    RouterLink,
  ],
  templateUrl: './day-selector.component.html',
  styleUrl: './day-selector.component.scss',
})
export class DaySelectorComponent implements OnInit, AfterViewInit {
  private configService = inject(ConfigService);
  private activatedRoute = inject(ActivatedRoute);

  daysToDisplay: DayVM[] = getDayToDisplay();
  selectedDay: DayVM = this.daysToDisplay[3]; // Le jour actuel est au milieu de l'affichage

  wateringSchedules$ = this.configService.getConfig$().pipe(
    map((config) => {
      return config.wateringSchedules;
    }),
  );

  @ViewChild('tablist')
  tablist!: any;

  ngOnInit(): void {
    combineLatest([this.activatedRoute.params, this.configService.getConfig$()])
      .pipe()
      .subscribe(([params, config]) => {
        // this.se
      });
    // this.setDays();
  }

  ngAfterViewInit(): void {
    this.scrollToSelectedDay();
  }

  setDays(): void {
    // this.selectedDay = this.daysToDisplay[3]; // Le jour actuel est au milieu de l'affichage
    // this.daysToDisplay = [this.daysToDisplay[3]];
  }

  getScheduleLogForDay(
    wateringSchedules: WateringSchedule[],
    selectedDay: DayVM,
  ): ScheduleLog[] {
    return getScheduleLogForDay(wateringSchedules, selectedDay.date);
  }

  private scrollToSelectedDay(): void {
    // const activeTab = document.get
    const tabNavElement = this.tablist.rootEl.getElementsByClassName(
      'p-tablist-content p-tablist-viewport',
    )[0];
    const activeTab = document.getElementById('p-tab-active');

    if (activeTab) {
      const tabOffset = activeTab.offsetLeft; // Position de la tab active
      const tabWidth = activeTab.offsetWidth; // Largeur de la tab active
      const containerWidth = tabNavElement.offsetWidth; // Largeur du conteneur des tabs
      const scrollPosition = tabOffset - containerWidth / 2 + tabWidth / 2; // Calcul pour centrer la tab
      // Défilement fluide vers la position calculée
      tabNavElement.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }
}

const getDayToDisplay = (): DayVM[] => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0 (Dimanche) à 6 (Samedi)
  const today = new Date();
  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // On crée un tableau des jours à afficher : 3 jours avant et 5 jours après le jour actuel
  const daysToDisplay = [];
  for (let i = -3; i <= 5; i++) {
    const dayIndex = (currentDay + i + 7) % 7; // Gère le cas du dépassement (ex: jours négatifs)
    const dayDate = new Date(today); // copier la date actuelle
    // Déplacer la date en fonction du décalage (i)
    dayDate.setDate(today.getDate() + i);

    daysToDisplay.push({
      name: daysOfWeek[dayIndex],
      number: dayDate.getDate(),
      date: dayDate,
    });
  }

  return daysToDisplay;
};
