import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { DiscoveryService } from '../discovery/discovery.service';

@Injectable()
export class FlowsService {
  @Inject(TokenService)
  private readonly tokenService: TokenService;

  @Inject(DiscoveryService)
  private readonly discoveryService: DiscoveryService;

  async clientCredentialsFlow(issuer_s: string) {
    const issuer = await this.discoveryService.get_issuer(issuer_s);
    const receivedToken = await this.tokenService.getToken(
      String(issuer.token_endpoint),
      {
        grant_type: process.env.CLIENT_CREDENTIALS_STRING,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        audience: process.env.AUDIENCE,
      },
    );

    const result = await this.tokenService
      .decodeToken(String(receivedToken.data.access_token))
      .then(async ([payload, header]) => {
        const validationResult = await this.tokenService
          .validateTokenSignature(
            issuer_s,
            String(receivedToken.data.access_token),
            true,
            '',
            '',
          )
          .then(() => {
            return [payload, header];
          });

        return validationResult;
      })
    return result;
  }
}
