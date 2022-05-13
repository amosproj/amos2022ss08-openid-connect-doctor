import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService)

  console.log(appService.getHello())

  // Read the user-information

  // Check the discovery endpoint for necessary information

  // Get a token

  // Return the information to the user

  await app.close()
}
bootstrap();
