//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
import { DiscoveryDto } from './discovery.dto';

export class DiscoveryResult {
  result: {
    success: boolean;
    schema_validation_success: boolean;
    html_result: string;
  };

  short_message: string;

  previous: {
    checked: DiscoveryDto;
    issuer: string;
    schemas: [string];
    validated_against_schema: boolean;
  };

  constructor(partial: Partial<DiscoveryResult>) {
    Object.assign(this, partial);
  }
}
