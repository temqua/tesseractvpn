import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ServersService } from './servers.service';
import { CreateServerDto } from './dto/create-server.dto';
import { UpdateServerDto } from './dto/update-server.dto';
import { ServerQueryDto, ServerUserQueryDto } from './dto/server-query.dto';
import { Server } from './entities/server.entity';

@ApiTags('servers')
@ApiBearerAuth()
@Controller('servers')
export class ServersController {
  constructor(private readonly serversService: ServersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать сервер' })
  @ApiOkResponse({ type: Server })
  async create(@Body() createServerDto: CreateServerDto) {
    return await this.serversService.create(createServerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Список серверов' })
  @ApiOkResponse({ type: Server, isArray: true })
  async findAll(@Query() dto: ServerQueryDto) {
    return await this.serversService.findAll(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Сервер по id' })
  @ApiOkResponse({ type: Server })
  async findOne(@Param('id') id: string) {
    return await this.serversService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить сервер' })
  @ApiOkResponse({ type: Server })
  async update(
    @Param('id') id: string,
    @Body() updateServerDto: UpdateServerDto,
  ) {
    return await this.serversService.update(+id, updateServerDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить сервер' })
  async remove(@Param('id') id: string) {
    return await this.serversService.remove(+id);
  }

  @Get(':id/users')
  @ApiOperation({ summary: 'Пользователи сервера' })
  async getUsers(@Param('id') id: string, @Query() dto: ServerUserQueryDto) {
    return await this.serversService.getUsers(Number(id), dto);
  }
}
