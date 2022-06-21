import { Inject, Injectable } from '@nestjs/common';
import { LoginUserDto } from './Dto/LoginUser.dto';
import { FlowsService } from '../flows/flows.service';
import { GrantBody } from 'openid-client';

@Injectable()
export class UserService {
  @Inject(FlowsService)
  private readonly flowsService: FlowsService;

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const result = await this.flowsService.clientCredentials(
      process.env.ISSUER_STRING,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
    );
    return JSON.stringify(result);
  }
}
