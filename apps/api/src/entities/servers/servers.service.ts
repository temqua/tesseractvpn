import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServersRepository } from './servers.repository';
import { ServerQueryDto, ServerUserQueryDto } from './dto/server-query.dto';
import { VPNProtocol } from '@prisma/client';
import env from '../../env';

@Injectable()
export class ServersService {
  constructor(private repository: ServersRepository) {}

  async create(createServerDto: CreateServerDto) {
    return await this.repository.create(
      createServerDto.name,
      createServerDto.url,
    );
  }

  async findAll(dto: ServerQueryDto) {
    return await this.repository.getAll(dto);
  }

  async findOne(id: number) {
    const server = await this.repository.getById(id);
    if (!server) {
      throw new NotFoundException(`Server with id ${id} not found`);
    }

    return server;
  }

  async update(id: number, updateServerDto: UpdateServerDto) {
    return await this.repository.update(id, updateServerDto);
  }

  async remove(id: number) {
    return await this.repository.delete(id);
  }

  async getUsers(id: number, dto?: ServerUserQueryDto) {
    const full = await this.repository.getUsers(id, dto);
    full.data = full.data.map((us) => ({
      ...us,
      downloadLink: this.generateDownloadLink(us),
    }));
    return full;
  }

  private generateDownloadLink(us) {
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
