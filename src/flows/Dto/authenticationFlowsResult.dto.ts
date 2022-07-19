export class AuthenticationFlowsResultDto {
  allowClientCredentials: boolean;
  allowPasswordGrant: boolean;
  allowAuthorizationCode: boolean;

  constructor(partial: Partial<AuthenticationFlowsResultDto>) {
    Object.assign(this, partial);
  }
}
