//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

export class TokenDto {
  issuer: string;
  token: string;
  schema: string;
  getKeysFromProvider: boolean;
  keyMaterialAlgorithm: string;
  keyMaterialFilepath: string;
}
