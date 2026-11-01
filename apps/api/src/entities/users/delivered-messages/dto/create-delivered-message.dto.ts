import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDeliveredMessageDto {
  @ApiProperty({ example: 'Текст сообщения' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
