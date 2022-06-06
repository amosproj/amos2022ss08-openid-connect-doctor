export class TokenResultDto {
  payload: string;
  header: string;
  success: boolean;
  message: string;

  constructor(partial: Partial<TokenResultDto>) {
    Object.assign(this, partial);
  }
}