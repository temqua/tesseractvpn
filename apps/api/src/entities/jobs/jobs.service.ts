import { Injectable } from '@nestjs/common';

@Injectable()
export class JobsService {
  async execute(id: string) {
    return id;
  }
}
