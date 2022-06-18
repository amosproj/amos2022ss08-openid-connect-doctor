import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
    imports: [ SettingsModule ],
    providers: [ HelperService ],
    exports: [ HelperService ]
})
export class HelperModule {}
