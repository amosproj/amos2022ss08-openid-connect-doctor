//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { SettingsService } from '../settings/settings.service';
import { HelperService } from '../helper/helper.service';

@Injectable()
export class DiscoveryService {
  @Inject(SettingsService)
  private readonly settingsService: SettingsService;
  @Inject(HelperService)
  private readonly helperService: HelperService;

  async getSchemas(schema_s: string) {
    return this.helperService.getSchemasHelper(schema_s, 'discovery');
  }

  async get_issuer(issuer_s) {
    return this.helperService.get_issuer(issuer_s);
  }

  getDefaultCheckboxes() {
    let x = {};
    for (const i in this.settingsService.config.discovery.parameter) {
      x[this.settingsService.config.discovery.parameter[i]] = 1;
    }
    return x;
  }

  async coloredFilteredValidation(
    issuer: object,
    schema_file: string,
    keys: any[],
  ) {
    const schema = join('..', '..', 'schema', schema_file);
    return await this.helperService.coloredFilteredValidationWithFileContent(
      issuer,
      schema,
      keys,
    );
  }
}
