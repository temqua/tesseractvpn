import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { UserQueryDto } from './dto/user-query.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  private logger = new Logger('UsersController');

  @Post()
  @ApiOperation({ summary: 'Создать пользователя' })
  @ApiOkResponse({ type: User })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Список пользователей' })
  @ApiOkResponse({ type: User, isArray: true })
  async findAll(@Query() query: UserQueryDto) {
    return await this.usersService.findAll(query);
  }

  @Get('unpaid')
  @ApiOperation({ summary: 'Пользователи с неоплаченными подписками' })
  async findUnpaid() {
    return await this.usersService.findUnpaid();
  }

  @Get('trial')
  @ApiOperation({ summary: 'Пользователи на пробном периоде' })
  async findTrial() {
    return await this.usersService.findTrial();
  }

  @Post('create-all')
  @ApiOperation({ summary: 'Создать подписки для всех пользователей' })
  async createAll() {
    return await this.usersService.createForAll();
  }
  @Delete('clear-all')
  @ApiOperation({ summary: 'Очистить все подписки' })
  async clearAll() {
    return await this.usersService.clearAll();
  }

  @Get('/:id/payments')
  @ApiOperation({ summary: 'Платежи пользователя' })
  async getPayments(@Param('id') id: string) {
    return await this.usersService.getUserPayments(id);
  }

  @Get('/:id/payments/last')
  @ApiOperation({ summary: 'Последний платёж пользователя' })
  async getLastPayment(@Param('id') id: string) {
    return await this.usersService.getLastUserPayment(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Пользователь по id' })
  @ApiOkResponse({ type: User })
  async findOne(@Param('id') id: string) {
    if (isNaN(Number(id))) {
      throw new BadRequestException('You must provide valid id');
    }
    const user = await this.usersService.findOne(Number(id));
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiOkResponse({ type: User })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  async remove(@Param('id') id: string) {
    try {
      return this.usersService.remove(+id);
    } catch (err) {
      this.logger.error(err);
    }
  }

  @Get('/:id/servers')
  @ApiOperation({ summary: 'Серверы пользователя' })
  async getServers(@Param('id') userId: string) {
    return this.usersService.listUserServers(Number(userId));
  }

  @Get('/:id/servers/:serverId')
  @ApiOperation({ summary: 'Записи пользователя по конкретному серверу' })
  async getUserServer(
    @Param('id') userId: string,
    @Param('serverId') serverId: string,
  ) {
    return this.usersService.listUserServerRecords(
      Number(userId),
      Number(serverId),
    );
  }

  @Get('/:id/subscription')
  @ApiOperation({ summary: 'Подписка пользователя' })
  async getSubscription(@Param('id') userId: string) {
    return await this.usersService.getSubscription(Number(userId));
  }

  @Post('/:id/subscription')
  @ApiOperation({ summary: 'Создать подписку пользователя' })
  async createSubscription(@Param('id') userId: string) {
    return await this.usersService.createSubscription(Number(userId));
  }

  @Delete('/:id/subscription')
  @ApiOperation({ summary: 'Удалить подписку пользователя' })
  async deleteSubscription(@Param('id') userId: string) {
    return await this.usersService.deleteSubscription(Number(userId));
  }

  @Post('/export')
  @ApiOperation({ summary: 'Экспорт пользователей' })
  async export() {
    return await this.usersService.export();
  }
}
