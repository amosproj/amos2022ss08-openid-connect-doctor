//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>

import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class UtilsService {
  logger: Logger;
  constructor() {
    this.logger = new Logger(UtilsService.name);
  }

  async writeOutput(programOutput: string) {
    if (programOutput === undefined || programOutput === null) {
      throw new HttpException(
        'The given program output is either undefined or empty',
        400,
      );
    }
    const dateTime = new Date();
    const header =
      'Generated On :: ' +
      dateTime +
      '\n' +
      '--------------------------------------------------------------------------------' +
      '\n';
    const fileName = 'program-output.txt';
    const dirPath = '../amos2022ss08-openid-connect-doctor/output/';
    if (fs.existsSync(dirPath)) {
      const writeSteam = fs.createWriteStream(dirPath + fileName);
      writeSteam.write(header + '\n' + programOutput);
      writeSteam.end();
    } else {
      return this.logger.error(`${dirPath} not found`);
    }
  }

}
