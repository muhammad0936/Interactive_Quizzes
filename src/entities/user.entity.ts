import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { UserType } from './enums/user-type.enum';

@Schema({ collection: 'user' })
export class User extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true, type: String, enum: UserType })
  userType: UserType;
}

export const UserSchema = SchemaFactory.createForClass(User);
