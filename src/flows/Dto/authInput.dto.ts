//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>

export class AuthInputDto {
  issuerString: string;
  clientId: string;
  clientSecret: string;
  url: string;
  redirectUri: string;
}
