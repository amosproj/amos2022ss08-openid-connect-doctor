//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>
//SDPX-FileCopyrightText: 2022 Sarah Julia Kriesch <sarah.j.kriesch@fau.de>

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { browser } from './app.browser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  browser();
  //console.log(appService.getHello())

  // Read the user-information

  // Check the discovery endpoint for necessary information

  // Get a token

  // Return the information to the user

  await app.listen(8081);
}
bootstrap();
