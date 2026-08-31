import { Injectable } from '@nestjs/common';
import { generateDownloadLink, getQRLink } from '../../utils';
import { CreateUsersServerDto } from './dto/create-users-server.dto';
import { UsersServersRepository } from './users-servers.repository';

@Injectable()
export class UsersServersService {
  constructor(private repository: UsersServersRepository) {}

  async create(createUsersServerDto: CreateUsersServerDto) {
    return await this.repository.create(createUsersServerDto);
  }

  async findAll() {
    const full = await this.repository.findAll();
    full.data = full.data.map((r) => {
      return {
        ...r,
        downloadLink: generateDownloadLink(r),
        qrLink: getQRLink(r),
      };
    });
    return full;
  }

  async findOne(id: number) {
    const record = await this.repository.findOne(id);
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }
    return {
      ...record,
      downloadLink: generateDownloadLink(record),
      qrLink: getQRLink(record),
    };
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }
}
