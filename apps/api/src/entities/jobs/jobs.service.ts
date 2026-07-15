import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeactivateUnpaidJob } from './deactivate_unpaid';
import { Job } from './jobs.definitions';
import { ModuleRef } from '@nestjs/core';
@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  private readonly jobClasses: Record<string, new (...args: any[]) => Job> = {
    deactivate_unpaid: DeactivateUnpaidJob,
  };
  constructor(private readonly moduleRef: ModuleRef) {}
  async execute(name: string) {
    const JobClass = this.jobClasses[name];
    if (!JobClass) {
      throw new NotFoundException(`Job "${name}" not found`);
    }
    const job = this.moduleRef.get(JobClass, { strict: false });

    job
      .execute()
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
