import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';

@Module({
  imports: [UserModule],
  providers: [AppService],
  controllers: [AppController],
})
export class AppModule {}
