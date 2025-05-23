import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.entity';
import { UserType } from './enums/user-type.enum';

@Schema({ collection: 'user' })
export class Student extends User {
  @Prop({ required: true, type: String })
  studentNumber: string;
  @Prop({ required: true, type: String, enum: UserType })
  userType = UserType.STUDENT;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
