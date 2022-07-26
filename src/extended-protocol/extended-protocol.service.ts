// 89-more-details-in-the-protocol
//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
import {HttpException, Inject, Injectable, Logger} from '@nestjs/common';

import { join } from 'path';
import { SettingsService } from '../settings/settings.service';
import { HelperService } from '../helper/helper.service';
import { promises as fsPromises } from 'fs';

@Injectable()
export class ExtendedProtocolService {
    private readonly logPath = './output';
    private readonly extLogFileName = './extLogger.html';
    private extLogFile = undefined;
    private extLogBuffer : string = '';

    private logger: Logger;

    constructor() {
        this.logger = new Logger(ExtendedProtocolService.name);
        const fs = require('fs');
        const logFile = join(this.logPath, this.extLogFileName);
        try {
            fs.rmSync(logFile);
        } catch {
        }
    }

    async extendedLogError(message: string) {
        if (message === undefined || message === null) {
            throw new HttpException('Extended Log Error message can not be undefined or null', 400);
        }
        await this.extendedLogHelper(message, 'red');
    }

    async extendedLogSuccess(message: string) {
        if (message === undefined || message === null) {
            throw new HttpException('Extended Log Success message can not be undefined or null', 400);
        }
        await this.extendedLogHelper(message, 'green');
    }

    async extendedLog(message: string) {
        if (message === undefined || message === null) {
            throw new HttpException('Extended Log message can not be undefined or null', 400);
        }
       await this.extendedLogHelper(message, 'black');
    }

     async extendedLogHelper(message: string, color: string) {
         if (message === undefined || message === null || typeof(message)=== undefined || color===undefined) {
             throw new HttpException('Extended Log Helper can not be undefined or null', 400);
         }
        const logFile = join(this.logPath, this.extLogFileName);
        if (this.extLogFile === undefined) {
            try {
                this.extLogFile = await fsPromises.open(logFile, 'a');
            } catch {
                this.logger.error(`Failed to open ${logFile}`);
            }
        }
        const dateTime = new Date();
        const log_line : string = `<span style="color:${color}">[${dateTime}] ${message}</span>\n`;
        this.extLogFile.write(log_line);
        this.extLogBuffer = this.extLogBuffer + log_line;
    }

    public get extLog() {
        this.extLogBuffer = this.extLogBuffer + '';
        return this.extLogBuffer;
    }
}
