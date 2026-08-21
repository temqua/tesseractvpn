import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database.service';
import { CreateUsersServerDto } from './dto/create-users-server.dto';
import { UserServerQueryDto } from './dto/user-server-query.dto';
import { Prisma, VPNProtocol } from '@prisma/client';

@Injectable()
export class UsersServersRepository {
  constructor(private databaseService: DatabaseService) {}

  async create(createUserServerDto: CreateUsersServerDto) {
    return await this.databaseService.client.serversUsers.create({
      data: {
        ...createUserServerDto,
      },
      include: {
        server: {},
        user: {},
      },
    });
  }

  async findAll(dto?: UserServerQueryDto) {
    const where: Prisma.ServersUsersWhereInput = {};
    if (dto?.username) {
      where.username = dto.username;
    }
    if (dto?.protocol) {
      where.protocol = dto.protocol as VPNProtocol;
    }
    if (dto?.url) {
      where.server = {
        url: {
          mode: 'insensitive',
          contains: dto?.url,
        },
      };
    }
    if (dto?.username) {
      where.username = {
        mode: 'insensitive',
        contains: dto?.username,
      };
    }
    const params = {
      skip: dto?.skip ? Number(dto.skip) : undefined,
      take: dto?.take ? Number(dto.take) : undefined,
      where,
      orderBy:
        dto?.orderBy && dto?.orderDirection
          ? {
              [dto.orderBy]: dto.orderDirection,
            }
          : undefined,
      include: {
        server: {},
        user: {},
      },
    };
    const countParams = {
      where,
    };
    const [data, count] = await this.databaseService.client.$transaction([
      this.databaseService.client.serversUsers.findMany(params),
      this.databaseService.client.serversUsers.count(countParams),
    ]);
    return {
      data,
      count,
    };
  }

  async findOne(id: number) {
    return await this.databaseService.client.serversUsers.findFirst({
      where: {
        id,
      },
      include: {
        server: {},
        user: {},
      },
    });
  }

  async remove(id: number) {
    return await this.databaseService.client.serversUsers.delete({
      where: {
        id,
      },
    });
  }
}
