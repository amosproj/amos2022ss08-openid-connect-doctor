//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>

export class AuthInputDto {
  authIssuer: string;
  clientId: string;
  clientSecret: string;
  responseType: string;
  redirectUri: string;
  state: string;
}
