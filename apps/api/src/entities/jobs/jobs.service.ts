import { Injectable, Logger, NotFoundException, Type } from '@nestjs/common';
import { DeactivateUnpaidJob } from './deactivate_unpaid';
import { Job } from './jobs.definitions';
import { ModuleRef } from '@nestjs/core';
@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly jobClasses: Record<string, Type<Job>> = {
    deactivate_unpaid: DeactivateUnpaidJob,
  };
  constructor(private readonly moduleRef: ModuleRef) {}

  getAll() {
    return Object.keys(this.jobClasses);
  }

  execute(name: string, body?: object) {
    const JobClass = this.jobClasses[name];
    if (!JobClass) {
      throw new NotFoundException(`Job "${name}" not found`);
    }
    const job = this.moduleRef.get(JobClass, { strict: false });

    job
      .execute(body)
      .then(() => {
        this.logger.log(`Job "${name}" completed`);
      })
      .catch((error) => {
        this.logger.error(
          `Job "${name}" failed: ${error.message}`,
          error.stack,
        );
      });
    return { message: `Job "${name}" started` };
  }
}
