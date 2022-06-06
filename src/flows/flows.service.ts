import { Injectable, Inject } from '@nestjs/common';
import { TokenService } from '../token/token.service';

@Injectable()
export class FlowsService {
  @Inject(TokenService)
  private readonly tokenService: TokenService;

  async clientCredentialsFlow(issuer_s: string) {
    const accessToken = await this.tokenService.requestToken(issuer_s);
    return accessToken;
  }
}
