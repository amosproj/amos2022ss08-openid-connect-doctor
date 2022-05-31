export class TokenResultDto {
  payload: string;
  header: string;

  constructor(partial: Partial<TokenResultDto>) {
    Object.assign(this, partial);
  }
}