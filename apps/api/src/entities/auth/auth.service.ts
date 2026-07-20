import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthPayload } from '../../auth.definitions';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException(`There is no user ${username} in system`);
    }

    if (!user.password) {
      throw new NotFoundException(
        'User does not have permissions to enter the system',
      );
    }
    const match = await bcrypt.compare(pass, user?.password);
    if (!match) {
      throw new UnauthorizedException();
    }
    const payload: AuthPayload = { id: user.id, username: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
