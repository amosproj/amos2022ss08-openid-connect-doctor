import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './token.service';
import TokenController from './token.controller';
import { DiscoveryModule } from 'src/discovery/discovery.module';

@Module({
  imports: [ConfigModule.forRoot(), DiscoveryModule],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
