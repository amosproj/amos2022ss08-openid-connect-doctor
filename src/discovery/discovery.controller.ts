//SDPX-License-Identifier: MIT
//SDPX-FileCopyrightText: 2022 Philip Rebbe <rebbe.philip@fau.de>
//SDPX-FileCopyrightText: 2022 Michael Kupfer <michael.kupfer@fau.de>
//SDPX-FileCopyrightText: 2022 Md Golam Muktadir <golam.muktadir@fau.de>

import {
  Controller,
  Get,
  Render,
  Query,
  Res,
  Post,
  Body,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import { createReadStream, promises as fs } from 'fs';
import { join } from 'path';

import { DiscoveryService } from './discovery.service';
import { DiscoveryDto } from './discovery.dto';
import { UtilsService } from '../utils/utils.service';
import { DiscoveryResult } from './discoveryResult.dto';

@Controller('discovery')
export class DiscoveryController {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get('issuer')
  @Render('start')
  async discover_issuer() {
    const schemas = await this.discoveryService.getSchemas(undefined);
    const res = {
      result: {
        success: 1,
        info: null,
        previously_checked: this.discoveryService.getDefaultCheckboxes(),
        previous_issuer: null,
      },
      short_message: 'Please input provider url',
      schemas: schemas,
    };
    return res;
  }

  @Get('issuer/find')
  @Render('discovery')
  async discover_issuer_find_get(@Query('issuer_s') issuer_url: string) {
    const dto = new DiscoveryDto();
    dto.issuer_url = issuer_url;

    const res = await this.checkIssuerUrlDetails(
      '',
      issuer_url,
      undefined,
      dto,
    );
    res.previous.checked = this.checkboxes_to_discoveryDto();
    await this.utilsService.writeOutput(res.result.html_result);
    return res;
  }

  @Post('issuer/find')
  @Render('discovery')
  async discover_issuer_find_post(@Body() body) {
    const dto = new DiscoveryDto();
    dto.issuer_url = body.issuer_url;

    const res = await this.checkIssuerUrlDetails(
      '',
      body.issuer_url,
      undefined,
      dto,
    );
    res.previous.checked = this.checkboxes_to_discoveryDto();
    await this.utilsService.writeOutput(res.result.html_result);
    return res;
  }

  private checkboxes_to_discoveryDto(): DiscoveryDto {
    const dto = new DiscoveryDto();
    for (const def_checkbox in this.discoveryService.getDefaultCheckboxes()) {
      dto[def_checkbox] = '1';
    }
    return dto;
  }

  @Post('issuer')
  @Render('discovery')
  async discover_issuer_analyze_post(@Body() discoveryDto: DiscoveryDto) {
    const keys = this.rememberSelectedParameters(discoveryDto);
    const res = await this.checkIssuerUrlDetails(
      discoveryDto.schema,
      discoveryDto.issuer_url,
      keys,
      discoveryDto,
    );
    await this.utilsService.writeOutput(res.result.html_result);
    return res;
  }

  private rememberSelectedParameters(checkboxes: DiscoveryDto) {
    const keys = [];
    for (const key in checkboxes) {
      if (checkboxes[key] === '1') {
        keys.push(key);
      }
    }
    return keys;
  }

  private async checkIssuerUrlDetails(
    schema_s: string,
    issuer_url_s: string,
    keys: any[],
    checkboxes: DiscoveryDto,
  ): Promise<DiscoveryResult> {
    const schemas = await this.discoveryService.getSchemas(schema_s);
    const previous = {
      checked: checkboxes,
      issuer: issuer_url_s,
      schemas: schemas,
      validated_against_schema: schema_s !== '' ? true : false,
    };
    if (issuer_url_s === undefined) {
      return {
        result: {
          success: true,
          schema_validation_success: false,
          html_result: null,
        },
        short_message: 'Please input provider url',
        previous: previous,
      };
    }
    let short_message = 'Provider found:';
    const [issuer_query_res, issuer_res] = await this.discoveryService
      .get_issuer(issuer_url_s)
      .then((issuer) => {
        return [
          {
            success: 1,
            info: JSON.stringify(issuer, keys, 2),
          },
          issuer,
        ];
      })
      .catch((err) => {
        return [
          {
            success: 0,
            info: err,
          },
          null,
        ];
      });
    if (issuer_query_res.success === 0) {
      short_message = 'Error, could not find provider:';
    }
    if (issuer_query_res.success === 1 && schema_s !== '') {
      const [success, info] =
        await this.discoveryService.coloredFilteredValidation(
          issuer_res,
          join('discovery', schema_s),
          keys,
        );
      issuer_query_res.success = success;
      issuer_query_res.info = info;
      if (success === 0) {
        short_message = 'Provider did not match schema';
      }
    }
    return {
      result: {
        success: issuer_query_res.success,
        schema_validation_success: issuer_query_res.success,
        html_result: issuer_query_res.info,
      },
      short_message: short_message,
      previous: previous,
    };
  }

  @Post('/schema/upload')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadSchema(@UploadedFile() file: Express.Multer.File, @Res() res) {
    await fs.writeFile(
      join(process.cwd(), 'schema/discovery', file.originalname),
      file.buffer,
    );
    res.status(201).end();
  }

  @Get('/schema/download')
  downloadSchema(@Query('schema') schema_s: string, @Res() res: Response) {
    const file = createReadStream(
      join(process.cwd(), 'schema/discovery', schema_s),
    );
    file.pipe(res);
  }

  @Get('/schema/delete')
  async deleteSchema(@Query('schema') schema_s: string, @Res() res: Response) {
    await fs.unlink(join(process.cwd(), 'schema/discovery', schema_s));
    res.status(200).end();
  }
}
