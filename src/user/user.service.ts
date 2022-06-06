import { Inject, Injectable } from '@nestjs/common';
import { LoginUserDto } from './Dto/LoginUser.dto';
import { FlowsService } from '../flows/flows.service';

@Injectable()
export class UserService {
  @Inject(FlowsService)
  private readonly flowsService: FlowsService;

  async login(loginUserDto: LoginUserDto): Promise<any> {
    return await this.flowsService.clientCredentialsFlow(
      process.env.ISSUER_STRING,
    );
  }
}
