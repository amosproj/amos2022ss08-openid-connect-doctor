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

@Controller('discovery')
export class DiscoveryController {
  constructor(
    private readonly discoveryService: DiscoveryService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get('issuer')
  @Render('index')
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

  @Post('issuer')
  @Render('discovery')
  async discover_issuer_post(@Body() discoveryDto: DiscoveryDto) {
    const keys = this.rememberSelectedParameters(discoveryDto);
    const res = await this.checkIssuerUrlDetails(
      discoveryDto.schema,
      discoveryDto.issuer_url,
      keys,
      discoveryDto,
    );
    await this.utilsService.writeOutput(res.result.info);
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
  ) {
    const schemas = await this.discoveryService.getSchemas(schema_s);
    if (issuer_url_s === undefined) {
      return {
        result: {
          success: 1,
          info: null,
          previously_checked: null,
		  previous_issuer: issuer_url_s,
        },
        short_message: 'Please input provider url',
        schemas: schemas,
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
            previously_checked: checkboxes,
			previous_issuer: issuer_url_s,
          },
          issuer,
        ];
      })
      .catch((err) => {
        return [
          {
            success: 0,
            info: err,
            previously_checked: null,
		    previous_issuer: issuer_url_s,
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
      result: issuer_query_res,
      short_message: short_message,
      schemas: schemas,
    };
  }

  @Post('/schema/upload')
  @UseInterceptors(FileInterceptor('upload'))
  async uploadSchema(@UploadedFile() file: Express.Multer.File, @Res() res) {
    await fs.writeFile(
      join(process.cwd(), 'schema/discovery', file.originalname),
      file.buffer,
    );
    res.status(302).redirect('/api/discovery/issuer');
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
    res.status(302).redirect('/api/discovery/issuer');
  }
}
