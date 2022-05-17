import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  //console.log(appService.getHello())

  // Read the user-information

  // Check the discovery endpoint for necessary information

  // Get a token

  // Return the information to the user

  await app.listen(8081);
}
bootstrap();
