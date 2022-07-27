//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
//SDPX-FileCopyrightText: 2022 Md Golam Muktadir <golam.muktadir@fau.de>

import { Inject, Injectable } from '@nestjs/common';
import { join } from 'path';
import { SettingsService } from '../settings/settings.service';
import { HelperService } from '../helper/helper.service';
import { ExtendedProtocolService } from '../extended-protocol/extended-protocol.service';

@Injectable()
export class DiscoveryService {
  @Inject(SettingsService)
  private readonly settingsService: SettingsService;
  @Inject(HelperService)
  private readonly helperService: HelperService;
  @Inject(ExtendedProtocolService)
  private readonly protocolService: ExtendedProtocolService;

  async getSchemas(schema_s: string) {
    return this.helperService.getSchemasHelper(schema_s, 'discovery');
  }

  async get_issuer(issuer_s) {
    return this.helperService.get_issuer(issuer_s);
  }

  getDefaultCheckboxes() {
    const x = {};
    for (const i in this.settingsService.config.discovery.parameter) {
      x[this.settingsService.config.discovery.parameter[i]] = 1;
    }
    return x;
  }

  async coloredFilteredValidation(issuer: any, schema_file: string, keys: any[]) {
    this.protocolService.extendedLog(`Validate issuer ${issuer.issuer} against ${schema_file}`);
    const schema = require(join('..', '..', 'schema', schema_file));
    const [ success, info ] = await this.helperService.coloredFilteredValidationWithFileContent(issuer, schema, keys);
    if (success === 1) {
      this.protocolService.extendedLogSuccess('Validation success');
    } else {
      this.protocolService.extendedLogError(`Validation failed: ${info}`);
    }
    return [ success, info ];
  }
}
