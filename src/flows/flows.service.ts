import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';

@Injectable()
export class FlowsService {
  @Inject(TokenService)
  private readonly tokenService: TokenService;

  async clientCredentialsFlow(issuer_s: string) {
    return await this.tokenService.requestToken(issuer_s);
  }
}
