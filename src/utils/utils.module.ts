//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Md Golam Muktadir <golam.muktadir@fau.de>


import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';

@Module({
  controllers: [UtilsController],
  providers: [UtilsService],
  exports:[UtilsService]
})
export class UtilsModule {}
