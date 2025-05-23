import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';
import { UserType } from './enums/user-type.enum';

@Schema({ collection: 'user' })
export class Admin extends User {
  @Prop({ required: true, type: String, enum: UserType })
  userType = UserType.ADMIN;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
