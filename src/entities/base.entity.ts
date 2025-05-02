import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class BaseEntity {
  _id: Types.ObjectId;

  @Prop()
  deletedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
