import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { FlowsModule } from './flows/flows.module';
import { ProtocolModule } from './protocol/protocol.module';
import {ProtocolService} from "./protocol/protocol.service";
import {ProtocolController} from "./protocol/protocol.controller";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    DiscoveryModule,
    TokenModule,
    ProtocolModule,
    FlowsModule,
  ],
  providers: [AppService, ProtocolService],
  controllers: [AppController, ProtocolController],
})
export class AppModule {}
