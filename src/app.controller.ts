import { Controller, Get, Render, Query } from '@nestjs/common';
import { Issuer } from 'openid-client';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return;
  }

  async get_issuer(issuer_s) {
    const issuer = await Issuer.discover(issuer_s);
    return issuer;
  }

  @Get('issuer')
  @Render('index')
  async discover_issuer(@Query('issuer') issuer_s: string) {
    return {
      result: await this.get_issuer(issuer_s)
        .then((issuer) => {
          console.log(issuer);
          return {
            success: 1,
            info: JSON.stringify(issuer, null, 2),
          };
        })
        .catch((err) => {
          return {
            success: 0,
            info: err,
          };
        }),
    };
  }
}
