//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';

@Module({
    providers: [ SettingsService ],
    exports: [ SettingsService ]
})
export class SettingsModule {}
