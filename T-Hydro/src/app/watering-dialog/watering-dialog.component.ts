import { Component, inject, OnDestroy } from '@angular/core';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Dialog } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WateringSchedule } from '../../service/Config';
import { Checkbox } from 'primeng/checkbox';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumber } from 'primeng/inputnumber';
import { SelectButton } from 'primeng/selectbutton';
import { Select } from 'primeng/select';
import { startWith } from 'rxjs';
import { Message } from 'primeng/message';
import { ConfigService } from '../../service/config.service';

type FrequencyDefaultValueOption = {
  label: string;
  value: number | null;
};

@Component({
  providers: [DialogService],
  selector: 'app-watering-dialog',
  imports: [
    Dialog,
    ReactiveFormsModule,
    Button,
    InputText,
    FloatLabel,
    InputNumber,
    SelectButton,
    Select,
    Message,
  ],
  templateUrl: './watering-dialog.component.html',
  styleUrl: './watering-dialog.component.scss',
})
export class WateringDialogComponent implements OnDestroy {
  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);
  private configService = inject(ConfigService);

  wateringForm: FormGroup;

  frequencyDefaultValueOptions: FrequencyDefaultValueOption[] = [
    { label: '1m', value: 1 },
    { label: '2m', value: 2 },
    { label: '5m', value: 5 },
    { label: '10m', value: 10 },
    { label: '30m', value: 30 },
    { label: '1h', value: 60 },
    { label: '2h', value: 120 },
    { label: '3h', value: 180 },
    { label: '4h', value: 240 },
    { label: '6h', value: 360 },
    { label: '12h', value: 720 },
    { label: '24h', value: 1440 },
    { label: '2j', value: 2880 },
    { label: '3j', value: 4320 },
    { label: '7j', value: 10080 },
    { label: 'Personnalisé', value: null },
  ];

  displayFrequencyCustom = false;

  outputOptions = [
    { name: '1', value: 1 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '6', value: 6 },
    { name: '7', value: 7 },
    { name: '8', value: 8 },
    { name: '9', value: 9 },
    { name: '10', value: 10 },
  ];

  frequencyDefaultValueOptionInitial!: FrequencyDefaultValueOption;

  constructor() {
    const watering = (this.dialogConfig.data as WateringSchedule) || {
      outputId: 1,
      name: '',
      isActive: true,
      startWateringDate: new Date().toISOString().slice(0, 16), // Par défaut à maintenant
      frequencyMinutes: 60,
      durationMinutes: 5,
    };

    // Find the initial frequency option or the last one
    this.frequencyDefaultValueOptionInitial =
      this.frequencyDefaultValueOptions.find(
        (option) => option.value === watering.frequencyMinutes,
      ) ??
      this.frequencyDefaultValueOptions[
        this.frequencyDefaultValueOptions.length - 1
      ];

    this.wateringForm = this.formBuilder.group({
      outputId: [watering.outputId, Validators.required],
      name: [watering.name, Validators.required],
      isActive: [watering.isActive, Validators.required],
      startWateringDate: [watering.startWateringDate, Validators.required],
      frequencyDefaultValueOption: [
        this.frequencyDefaultValueOptionInitial,
        Validators.required,
      ],
      frequencyMinutes: [
        watering.frequencyMinutes,
        [Validators.required, Validators.min(1)],
      ],
      durationMinutes: [
        watering.durationMinutes,
        [Validators.required, Validators.min(1)],
      ],
    });

    // Forbid to change isActive with null value and keep previous value
    let previousIsActive = this.wateringForm.get('isActive')?.value;
    this.wateringForm
      .get('isActive')
      ?.valueChanges.pipe(startWith(previousIsActive))
      .subscribe((value) => {
        if (value === null) {
          setTimeout(() => {
            this.wateringForm.get('isActive')?.setValue(previousIsActive, {
              emitEvent: false,
            });
          }, 0);
        } else {
          previousIsActive = value;
        }
      });

    // On frequencyDefaultValueOption change
    this.wateringForm
      .get('frequencyDefaultValueOption')
      ?.valueChanges?.pipe(
        startWith(this.wateringForm.get('frequencyDefaultValueOption')?.value),
      )
      .subscribe((option: FrequencyDefaultValueOption) => {
        if (option.value === null) {
          this.displayFrequencyCustom = true;
          this.wateringForm
            .get('frequencyMinutes')
            ?.setValue(this.wateringForm.get('frequencyMinutes')?.value ?? 1);
        } else {
          this.displayFrequencyCustom = false;
          this.wateringForm.get('frequencyMinutes')?.setValue(option.value);
        }
      });
  }

  save() {
    if (this.wateringForm.valid) {
      if (!!this.dialogConfig.data) {
        this.configService
          .updateWateringSchedule({
            ...this.dialogConfig.data,
            ...this.wateringForm.value,
          })
          .subscribe();
      } else {
        this.configService
          .addWateringSchedule(this.wateringForm.value)
          .subscribe();
      }

      this.dialogRef.close(this.wateringForm.value);
    }
  }

  cancel() {
    this.dialogRef.close(null);
  }

  ngOnDestroy() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
