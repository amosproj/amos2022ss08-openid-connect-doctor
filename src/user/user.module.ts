import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FlowsModule } from '../flows/flows.module';

@Module({
  imports: [FlowsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
