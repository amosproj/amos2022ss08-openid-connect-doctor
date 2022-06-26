//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { FlowsModule } from './flows/flows.module';
import { ProtocolModule } from './protocol/protocol.module';
import { ProtocolService } from './protocol/protocol.service';
import { ProtocolController } from './protocol/protocol.controller';
import { LoggerMiddleware } from './utils/logger.middleware';
import { SettingsModule } from './settings/settings.module';
import { HelperModule } from './helper/helper.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DiscoveryModule,
    TokenModule,
    ProtocolModule,
    FlowsModule,
    SettingsModule,
    HelperModule,
  ],
  providers: [AppService, ProtocolService],
  controllers: [AppController, ProtocolController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
