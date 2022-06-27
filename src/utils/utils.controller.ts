import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('utils')
export class UtilsController {
  @Get('/downloadFile')
  downloadFile(@Res() res: Response) {
    const fileName = 'program-output.txt';
    const file = createReadStream(join(process.cwd(), '/logfiles', fileName));
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="' + fileName + '"',
    );
    file.pipe(res);
  }
}
