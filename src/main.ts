import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const appService = app.get(AppService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  //console.log(appService.getHello())

  // Read the user-information

  // Check the discovery endpoint for necessary information

  // Get a token

  // Return the information to the user

  await app.listen(8081);
}
bootstrap();
