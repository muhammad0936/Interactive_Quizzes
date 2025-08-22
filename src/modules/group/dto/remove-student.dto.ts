import { IsArray, IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RemoveStudentDto {
  @ApiProperty({
    description: 'Array of student IDs to remove from the group',
    example: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'],
    type: [String]
  })
  @IsArray()
  @IsMongoId({ each: true })
  @IsNotEmpty()
  studentIds: string[];
}
