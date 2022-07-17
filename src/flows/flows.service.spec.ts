//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import { Test, TestingModule } from '@nestjs/testing';
import { SettingsModule } from '../settings/settings.module';
import { FlowsService } from './flows.service';
import { TokenModule } from '../token/token.module';
import { DiscoveryModule } from '../discovery/discovery.module';
import { UtilsModule } from '../utils/utils.module';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';

describe('FlowsService', () => {
  let service: FlowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SettingsModule,
        TokenModule,
        DiscoveryModule,
        UtilsModule,
        ExtendedProtocolModule,
      ],
      providers: [FlowsService],
    }).compile();

    service = module.get<FlowsService>(FlowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('clientCredentials', () => {
    it('should fail if no issuer is provided', async () => {
      await expect(
        service.clientCredentials(
          undefined,
          'client_id',
          'client_secret',
          'audience',
        ),
      ).rejects.toThrow('There was no issuer to validate the token against!');
    });

    it('should fail if issuer is empty', async () => {
      await expect(
        service.clientCredentials('', 'client_id', 'client_secret', 'audience'),
      ).rejects.toThrow('There was no issuer to validate the token against!');
    });

    it('should fail if no client id is provided', async () => {
      await expect(
        service.clientCredentials(
          'issuer_s',
          undefined,
          'client_secret',
          'audience',
        ),
      ).rejects.toThrow('There was no client id provided');
    });

    it('should fail if client id is empty', async () => {
      await expect(
        service.clientCredentials('issuer_s', '', 'client_secret', 'audience'),
      ).rejects.toThrow('There was no client id provided');
    });

    it('should fail if no client secret is provided', async () => {
      await expect(
        service.clientCredentials(
          'issuer_s',
          'client_id',
          undefined,
          'audience',
        ),
      ).rejects.toThrow('There was no client secret provided');
    });

    it('should fail if client secret is empty', async () => {
      await expect(
        service.clientCredentials('issuer_s', 'client_id', '', 'audience'),
      ).rejects.toThrow('There was no client secret provided');
    });
  });
});
