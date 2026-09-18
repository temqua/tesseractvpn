import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('/')
  getAll() {
    return this.jobsService.getAll();
  }

  @Post('/:name/execute')
  @HttpCode(HttpStatus.OK)
  execute(@Param('name') name: string, @Body() body) {
    return this.jobsService.execute(name, body);
  }
}
