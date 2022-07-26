//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <raghunandan.arava@fau.de>
//SDPX-FileCopyrightText: 2022 Raghunandan Arava <michael.kupfer@fau.de>

export class AuthInputDto {
  issuer: string;
  clientId: string;
  clientSecret: string;
  url: string;
  redirectUri: string;
}
