import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IsPublic } from '../../decorators/is-public';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход по логину и паролю' })
  @ApiOkResponse({
    description: 'JWT access token',
    schema: { type: 'object', properties: { accessToken: { type: 'string' } } },
  })
  @Post('/')
  signIn(@Body() dto: Record<string, string>) {
    return this.authService.signIn(dto.username, dto.password);
  }

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход по Telegram' })
  @ApiOkResponse({
    description: 'JWT access token',
    schema: { type: 'object', properties: { accessToken: { type: 'string' } } },
  })
  @Post('/tg')
  signInViaTg(@Body() dto: Record<string, string>) {
    return this.authService.signInViaTelegram(dto.tgToken, dto.telegramId);
  }
}
