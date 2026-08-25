import { Injectable } from '@nestjs/common';
import { CreateUsersServerDto } from './dto/create-users-server.dto';
import { UsersServersRepository } from './users-servers.repository';
import { VPNProtocol } from '@prisma/client';
import env from '../../env';

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
        downloadLink: this.generateDownloadLink(r),
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
      downloadLink: this.generateDownloadLink(record),
    };
  }

  async remove(id: number) {
    return await this.repository.remove(id);
  }

  private generateDownloadLink(
    us: Awaited<ReturnType<typeof this.repository.findOne>>,
  ) {
    let port = env.IKE_RECEIVER_PORT;
    if (us?.protocol === VPNProtocol.IKEv2) {
      port = env.IKE_RECEIVER_PORT;
    } else if (us?.protocol === VPNProtocol.WireGuard) {
      port = env.WG_RECEIVER_PORT;
    } else {
      port = env.OVPN_RECEIVER_PORT;
    }
    return `${us?.server.url}:${port}/file?username=${us?.username}`;
  }
}
