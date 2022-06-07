import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { TokenModule } from './token/token.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, TokenModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
