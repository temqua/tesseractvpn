import { Controller, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post('/:name/execute')
  @HttpCode(HttpStatus.OK)
  execute(@Param('name') name: string) {
    return this.jobsService.execute(name);
  }
}
