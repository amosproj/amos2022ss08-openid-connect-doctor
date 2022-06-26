export class ClientCredentialFlowResultDto {
  payload: string;
  header: string;
  success: boolean;
  message: string;

  constructor(partial: Partial<ClientCredentialFlowResultDto>) {
    Object.assign(this, partial);
  }
}
