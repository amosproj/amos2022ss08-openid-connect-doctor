import { Inject, Injectable } from '@nestjs/common';
import { TokenService } from '../token/token.service';
import { DiscoveryService } from '../discovery/discovery.service';
import { ExtendedProtocolService } from '../extended-protocol/extended-protocol.service';

@Injectable()
export class FlowsService {
  @Inject(TokenService)
  private readonly tokenService: TokenService;
  @Inject(ExtendedProtocolService)
  private readonly protocolService: ExtendedProtocolService;

  @Inject(DiscoveryService)
  private readonly discoveryService: DiscoveryService;

  async clientCredentialsFlow(issuer_s: string) {
    this.protocolService.extendedLog(`Start client credentials flow for ${issuer_s}`);
    const issuer = await this.discoveryService.get_issuer(issuer_s);
    try {
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
      this.protocolService.extendedLogSuccess(`Client credential flow for ${issuer_s} succeeded`);
      return result;
    } catch {
      this.protocolService.extendedLogError(`Client credential flow for ${issuer_s} failed`);
    }
  }
}
