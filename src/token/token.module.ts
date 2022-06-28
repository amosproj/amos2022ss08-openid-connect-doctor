//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './token.service';
import TokenController from './token.controller';
import { DiscoveryModule } from '../discovery/discovery.module';
import { SettingsModule } from '../settings/settings.module';
import { HelperModule } from '../helper/helper.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule,
    SettingsModule,
    HelperModule,
    UtilsModule,
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
