import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { Dock } from 'primeng/dock';
import { Tooltip } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { WateringDialogComponent } from './watering-dialog/watering-dialog.component';

@Component({
  selector: 'app-root',
  providers: [DialogService],
  imports: [RouterOutlet, Dock, Tooltip, Button, RouterLinkActive, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  private router = inject(Router);
  private dialogService = inject(DialogService);

  items: MenuItem[] = [
    {
      label: 'Agenda',
      icon: 'pi pi-calendar',
      routerLink: '/calendar',
    },
    {
      label: "Nouveau programme d'arrosage",
      icon: 'pi pi-plus',
      command: this.openWateringDialog.bind(this),
    },
    {
      label: "Programmes d'arrosages",
      icon: 'pi pi-list-check',
      routerLink: '/waterings',
    },
    {
      label: 'Commande manuelle',
      icon: 'pi pi-crown', // pi-crown // pi-hammer
      routerLink: '/manual-watering',
    },
    {
      label: 'Show logs',
      icon: 'pi pi-list',
      routerLink: '/logs',
    },
  ];
  isDialogOpen = false;

  isRouteActive(menuItem: MenuItem): boolean {
    if (menuItem.label == this.items[1].label) {
      return this.isDialogOpen;
    }
    return this.router.url.startsWith(menuItem.routerLink);
  }

  private openWateringDialog() {
    this.isDialogOpen = true;
    this.dialogService
      .open(WateringDialogComponent, {
        header: "Nouveau programme d'arrosage",
        width: '70%',
        baseZIndex: 10000,
        modal: true,
        closable: true,
      })
      .onClose.subscribe(() => {
        this.isDialogOpen = false;
      });
  }
}
