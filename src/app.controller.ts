import { Controller, Get, Render, Query } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return;
  }

  @Get('issuer')
  @Render('index')
  discover_issuer(@Query('issuer') issuer: string) {
    return { result: issuer };
  }
}
