//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
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
