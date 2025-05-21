// create-group.dto.ts
import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Group } from '../../../entities/group.entity';
import { Types } from 'mongoose';

export class CreateGroupDto extends Group {
  @IsMongoId()
  @IsNotEmpty()
  declare teacher: Types.ObjectId; // Ensure this matches the DTO input type (ObjectId string)

  @IsMongoId()
  @IsNotEmpty()
  declare material: Types.ObjectId;

  @IsMongoId({ each: true }) // Validate each student ID in the array
  @IsNotEmpty()
  declare students: Types.ObjectId[];
}
