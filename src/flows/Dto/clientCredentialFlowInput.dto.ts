//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

export class ClientCredentialFlowInputDto {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;

  constructor(partial: Partial<ClientCredentialFlowInputDto>) {
    Object.assign(this, partial);
  }
}
