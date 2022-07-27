//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Md Golam Muktadir <golam.muktadir@fau.de>


import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { ProtocolService } from './protocol.service';
import { ProtocolLogger } from './protocolLogger';

@Controller('protocol')
export class ProtocolController {
  constructor(private readonly protocolService: ProtocolService) {}

  @Get('logger')
  @Render('protocol')
  async showLogMessage() {
    const readLastLines = require('read-last-lines');
    let data: any;
    const request_logs = await readLastLines
      .read('./logfiles/tempLogger.txt', 50)
      .then(async (lines) => {
        let listOfObjects = [];
        let splitLines = lines.split('\n');
        let counter = 0;
        for (let i = splitLines.length - 2; i >= 0; i--) {
          let decode = splitLines[i].split('>>');
          let obj = new ProtocolLogger(decode[1], decode[0], ++counter);
          listOfObjects.push(obj);
        }
        data = await this.protocolService.myStringify(listOfObjects);
        return data;
      })
      .catch((e: any) => {
        throw new InternalServerErrorException('Could not create user');
      });

    return {
      version: process.env.npm_package_version,
      requests: request_logs,
      protocol: await this.protocolService.getExtLog(),
    };
  }

  @Get('toggleLogger')
  async toggleLogger(@Query('toggleLogger') toggleLogger: number) {
    await this.protocolService.toggleWriteStatus(toggleLogger);
  }
}
