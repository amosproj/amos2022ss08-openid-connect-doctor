import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { SettingsModule } from '../settings/settings.module';
import { HelperModule } from '../helper/helper.module';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';

@Module({
  imports: [SettingsModule, HelperModule, ExtendedProtocolModule],
  controllers: [DiscoveryController],
  providers: [DiscoveryService],
  exports: [DiscoveryService],
})
export class DiscoveryModule {}
