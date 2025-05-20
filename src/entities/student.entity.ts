import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';

@Schema()
export class Student extends BaseEntity {
  @Prop()
  name: string;

  @Prop()
  studentNumber: string;
}

export const StudentSchema = SchemaFactory.createForClass(Student);
