//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Md Golam Muktadir <golam.muktadir@fau.de>


import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('utils')
export class UtilsController {
  @Get('/downloadFile')
  downloadFile(@Res() res: Response) {
    const dateTime = new Date();
    const fileName = 'program-output.txt';
    const file = createReadStream(join(process.cwd(), '/output', fileName));
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="' +
        dateTime.getDate() +
        '-' +
        dateTime.getMonth() +
        '-' +
        dateTime.getFullYear() +
        '-' +
        dateTime.getHours() +
        '-' +
        dateTime.getMinutes() +
        '-' +
        dateTime.getSeconds() +
        '-' +
        fileName +
        '"',
    );
    file.pipe(res);
  }
}
