import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUsersServerDto } from './dto/create-users-server.dto';
import { UsersServersService } from './users-servers.service';
import { UsersServers } from './entities/users-server.entity';

@ApiTags('users-servers')
@ApiBearerAuth()
@Controller('users-servers')
export class UsersServersController {
  constructor(private readonly usersServersService: UsersServersService) {}

  @Post()
  @ApiOperation({ summary: 'Назначить сервер пользователю' })
  @ApiOkResponse({ type: UsersServers })
  create(@Body() createUsersServerDto: CreateUsersServerDto) {
    return this.usersServersService.create(createUsersServerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Список связок пользователь-сервер' })
  @ApiOkResponse({ type: UsersServers, isArray: true })
  findAll() {
    return this.usersServersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Связка пользователь-сервер по id' })
  @ApiOkResponse({ type: UsersServers })
  findOne(@Param('id') id: string) {
    return this.usersServersService.findOne(Number(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить связку пользователь-сервер' })
  remove(@Param('id') id: string) {
    return this.usersServersService.remove(+id);
  }
}
