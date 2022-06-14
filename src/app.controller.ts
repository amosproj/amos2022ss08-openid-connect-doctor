//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>

import {
  Controller,
  Get,
  Delete,
  Render,
  Query,
  HttpException,
  HttpStatus,
  Res,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Issuer, GrantBody } from 'openid-client';
import { AppService } from './app.service';
import { Express, Response } from 'express';
import { createReadStream, promises as fs } from 'fs';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return;
  }
}
