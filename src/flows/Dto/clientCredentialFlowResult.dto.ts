//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

export class FlowResultDto {
  payload: string;
  header: string;
  success: boolean;
  message: string;

  constructor(partial: Partial<FlowResultDto>) {
    Object.assign(this, partial);
  }
}
