//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
export class TokenResultPage {
  show_results: boolean;
  message: string;

  result: {
    header: string;
    payload: string;
  };

  previous: {
    issuer: string;
    token: string;
    schemas_header: [string];
    schemas_payload: [string];
    validated_header_against_schema: boolean;
    validated_payload_against_schema: boolean;
    header_match_error: boolean;
    payload_match_error: boolean;
    match_error: boolean;
  };

  key_algorithms: any[];

  constructor(partial: Partial<TokenResultPage>) {
    Object.assign(this, partial);
  }
}
