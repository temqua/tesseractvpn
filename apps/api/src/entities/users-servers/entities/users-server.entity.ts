import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VPNProtocol } from '@prisma/client';
import { User } from '../../users/entities/user.entity';
import { Server } from '../../servers/entities/server.entity';

export class UsersServers {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 1 })
  serverId: number;

  @ApiProperty({ enum: VPNProtocol, example: VPNProtocol.WireGuard })
  protocol: VPNProtocol;

  @ApiPropertyOptional({ example: 'username', nullable: true })
  username?: string | null;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  assignedAt: Date;

  @ApiProperty({ type: () => User })
  user: User;

  @ApiProperty({ type: () => Server })
  server: Server;
}
