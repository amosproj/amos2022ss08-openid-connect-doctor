import { Module } from '@nestjs/common';
import { FlowsController } from './flows.controller';
import { FlowsService } from './flows.service';
import { TokenModule } from '../token/token.module';
import { DiscoveryModule } from '../discovery/discovery.module';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';

@Module({
  imports: [TokenModule, DiscoveryModule, ExtendedProtocolModule],
  controllers: [FlowsController],
  providers: [FlowsService],
  exports: [FlowsService],
})
export class FlowsModule {}
