import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { SettingsModule } from '../settings/settings.module';
import { HelperModule } from '../helper/helper.module';
import {UtilsService} from "../utils/utils.service";
import {UtilsModule} from "../utils/utils.module";

@Module({
  imports: [SettingsModule, HelperModule,UtilsModule],
  controllers: [DiscoveryController],
  providers: [DiscoveryService],
  exports: [DiscoveryService],
})
export class DiscoveryModule {}
