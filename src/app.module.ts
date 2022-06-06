import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { TokenModule } from './token/token.module';
import { FlowsModule } from './flows/flows.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, DiscoveryModule, TokenModule, FlowsModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
