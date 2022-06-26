export class ClientCredentialFlowInputDto {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;

  constructor(partial: Partial<ClientCredentialFlowInputDto>) {
    Object.assign(this, partial);
  }
}
