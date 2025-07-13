import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQuizDto {
  @IsNotEmpty()
  @IsString()
  group: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  scheduledAt?: Date;
}
