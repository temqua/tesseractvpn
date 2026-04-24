import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IsPublic } from '../../decorators/is-public';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @Post('/')
  signIn(@Body() dto: Record<string, any>) {
    return this.authService.signIn(dto.username, dto.password);
  }
}
