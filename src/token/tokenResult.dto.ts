//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

export class TokenResultDto {
  payload: string;
  header: string;
  success: boolean;
  message: string;

  constructor(partial: Partial<TokenResultDto>) {
    Object.assign(this, partial);
  }
}