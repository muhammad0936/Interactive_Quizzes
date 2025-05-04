import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';
import { UserType } from './enums/user-type.enum';

@Schema({ collection: 'user' })
export class Teacher extends User {
  @Prop({ required: true, type: String, enum: UserType })
  userType: UserType = UserType.TEACHER;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);
