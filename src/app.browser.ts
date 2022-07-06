//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Sarah Julia Kriesch <sarah.j.kriesch@fau.de>

// eslint-disable-next-line @typescript-eslint/no-var-requires
const open = require('open');

export async function browser(): Promise<void> {
  try {
    await open('http://localhost:8081');
  } catch (e) {
    e.message = `No default browser installed`;
    throw e;
  }
}
