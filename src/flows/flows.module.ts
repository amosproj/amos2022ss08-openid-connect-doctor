//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>

import { Module } from '@nestjs/common';
import { FlowsController } from './flows.controller';
import { FlowsService } from './flows.service';
import { TokenModule } from '../token/token.module';
import { DiscoveryModule } from '../discovery/discovery.module';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [TokenModule, DiscoveryModule, ExtendedProtocolModule, UtilsModule],
  controllers: [FlowsController],
  providers: [FlowsService],
  exports: [FlowsService],
})
export class FlowsModule {}
