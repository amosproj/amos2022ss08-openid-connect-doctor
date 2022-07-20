//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { SettingsModule } from '../settings/settings.module';
import { ExtendedProtocolModule } from '../extended-protocol/extended-protocol.module';

@Module({
    imports: [ SettingsModule, ExtendedProtocolModule ],
    providers: [ HelperService ],
    exports: [ HelperService ]
})
export class HelperModule {}
