export class PasswordGrantFlowInputDto {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;

  constructor(partial: Partial<PasswordGrantFlowInputDto>) {
    Object.assign(this, partial);
  }
}
