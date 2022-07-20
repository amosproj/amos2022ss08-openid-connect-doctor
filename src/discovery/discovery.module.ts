//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { SettingsModule } from '../settings/settings.module';
import { HelperModule } from '../helper/helper.module';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';
import {UtilsService} from "../utils/utils.service";
import {UtilsModule} from "../utils/utils.module";

@Module({
  imports: [SettingsModule, HelperModule, ExtendedProtocolModule, UtilsModule],
  controllers: [DiscoveryController],
  providers: [DiscoveryService],
  exports: [DiscoveryService],
})
export class DiscoveryModule {}
