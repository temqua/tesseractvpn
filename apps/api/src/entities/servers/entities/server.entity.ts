import { ApiProperty } from '@nestjs/swagger';

export class Server {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Основной сервер' })
  name: string;

  @ApiProperty({ example: 'https://vpn.example.com' })
  url: string;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;
}
