import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JobsService, TesseractJob } from './jobs.service';

@ApiTags('jobs')
@ApiBearerAuth()
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('/')
  @ApiOperation({ summary: 'Список доступных задач' })
  getAll() {
    return this.jobsService.getAll();
  }

  @Post('/:name/execute')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Запустить задачу' })
  execute(@Param('name') name: TesseractJob, @Body() body) {
    return this.jobsService.execute(name, body);
  }
}
