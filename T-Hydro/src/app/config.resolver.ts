import { ResolveFn } from '@angular/router';
import { Config } from '../service/Config';
import { inject } from '@angular/core';
import { ConfigService } from '../service/config.service';

export const configResolver: ResolveFn<Config> = (route, state) => {
  const configService = inject(ConfigService);

  return configService.getConfig$();
};
