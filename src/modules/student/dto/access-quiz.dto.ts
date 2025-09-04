import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccessQuizDto {
  @ApiProperty({
    description: 'The 8-digit access code of the quiz',
    example: '12345678',
    minLength: 8,
    maxLength: 8,
  })
  @IsString()
  @IsNotEmpty()
  accessCode: string;
}
