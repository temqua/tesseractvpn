import { Injectable } from '@nestjs/common';
import { Prisma, VpnServer } from '@prisma/client';
import { DatabaseService } from '../../database.service';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServerQueryDto } from './dto/server-query.dto';

@Injectable()
export class ServersRepository {
  constructor(private databaseService: DatabaseService) {}

  async getAll(dto: ServerQueryDto) {
    const where: Prisma.VpnServerWhereInput = {};
    if (dto?.id) {
      where.id = Number(dto?.id);
    }
    if (dto?.name) {
      where.name = {
        mode: 'insensitive',
        contains: dto?.name,
      };
    }
    if (dto?.url) {
      where.name = {
        mode: 'insensitive',
        contains: dto?.url,
      };
    }

    const params = {
      skip: dto?.skip ? Number(dto.skip) : undefined,
      take: dto?.take ? Number(dto.take) : undefined,
      where,
    };
    const countParams = {
      where,
    };
    const [data, count] = await this.databaseService.client.$transaction([
      this.databaseService.client.vpnServer.findMany(params),
      this.databaseService.client.vpnServer.count(countParams),
    ]);
    return {
      data,
      count,
    };
  }

  async create(name: string, url: string) {
    return await this.databaseService.client.vpnServer.create({
      data: {
        name,
        url,
      },
    });
  }

  async delete(id: number) {
    await this.databaseService.client.serversUsers.deleteMany({
      where: {
        serverId: id,
      },
    });
    return await this.databaseService.client.vpnServer.delete({
      where: {
        id,
      },
    });
  }

  async getUsers(id: number) {
    return await this.databaseService.client.serversUsers.findMany({
      where: {
        serverId: id,
      },
      include: {
        user: {},
      },
    });
  }

  async getById(id: number): Promise<VpnServer | null> {
    return await this.databaseService.client.vpnServer.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdateServerDto) {
    return await this.databaseService.client.vpnServer.update({
      where: {
        id,
      },
      data,
    });
  }
}
