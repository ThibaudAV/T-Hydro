import { Component } from '@angular/core';
import { Button } from 'primeng/button';
import { Badge } from 'primeng/badge';
import { TableModule } from 'primeng/table';

type ValveVM = {
  number: number;
  state: 'FORCED_ON' | 'DISABLED' | 'RUNNING';
};

@Component({
  selector: 'app-manual-watering',
  imports: [Button, Badge, TableModule],
  templateUrl: './manual-watering.component.html',
  styleUrl: './manual-watering.component.scss',
})
export class ManualWateringComponent {
  valves: ValveVM[] = [
    { number: 1, state: 'RUNNING' },
    { number: 2, state: 'RUNNING' },
    { number: 3, state: 'FORCED_ON' },
    { number: 4, state: 'DISABLED' },
    { number: 5, state: 'DISABLED' },
    { number: 6, state: 'DISABLED' },
    { number: 7, state: 'DISABLED' },
    { number: 8, state: 'DISABLED' },
  ];
}
