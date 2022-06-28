import { Inject, Injectable, Logger } from '@nestjs/common';
import { join } from 'path';
import { SettingsService } from '../settings/settings.service';
import { HelperService } from '../helper/helper.service';
import { promises as fsPromises } from 'fs';

@Injectable()
export class ExtendedProtocolService {
    private readonly logPath = './logfiles';
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
        this.extendedLogHelper(message, 'red');
    }

    async extendedLogSuccess(message: string) {
        this.extendedLogHelper(message, 'green');
    }

    async extendedLog(message: string) {
        this.extendedLogHelper(message, 'black');
    }

    private async extendedLogHelper(message: string, color: string) {
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
