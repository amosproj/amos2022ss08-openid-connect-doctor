//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

export class TokenDto {
  issuer: string;
  token: string;
  schema_header: string;
  schema_payload: string;
  getKeysFromProvider: boolean;
  keyMaterialAlgorithm: string;
  keyMaterialFilepath: string;
}
