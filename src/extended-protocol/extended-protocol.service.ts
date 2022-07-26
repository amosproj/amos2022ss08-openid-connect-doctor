//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
import { Inject, Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { SettingsService } from '../settings/settings.service';
import { HelperService } from '../helper/helper.service';
import { promises as fsPromises } from 'fs';

@Injectable()
export class ExtendedProtocolService {
    private extLogBuffer : string = '';

    private logger: Logger;

    constructor() {
        this.logger = new Logger(ExtendedProtocolService.name);
        const fs = require('fs');
    }

    async extendedLogError(message: string) {
        this.extendedLogHelper(message, 'red');
    }

    async extendedLogSuccess(message: string) {
        this.extendedLogHelper(message, 'green');
    }

    async extendedLog(message: string) {
        this.extendedLogHelper(message, 'black');
    }

    private async extendedLogHelper(message: string, color: string) {
        const dateTime = new Date();
        const log_line : string = `<span style="color:${color}">[${dateTime}] ${message}</span>\n`;
        this.extLogBuffer = this.extLogBuffer + log_line;
    }

    public get extLog() {
        this.extLogBuffer = this.extLogBuffer + '';
        return this.extLogBuffer;
    }
}
