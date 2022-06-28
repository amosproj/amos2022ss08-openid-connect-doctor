//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './token.service';
import TokenController from './token.controller';
import { DiscoveryModule } from '../discovery/discovery.module';
import { SettingsModule } from '../settings/settings.module';
import { HelperModule } from '../helper/helper.module';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule,
    SettingsModule,
    HelperModule,
    ExtendedProtocolModule
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
