import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { SchemaTypes } from 'mongoose';
import { Student } from './student.entity';
import { Course } from './course.entity';

@Schema({ collection: 'group' })
export class Group extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: SchemaTypes.ObjectId, ref: Course.name })
  course: Course;

  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: Student.name,
    default: () => [],
  })
  students: Student[];

  year: string;
}

export const GroupSchema = SchemaFactory.createForClass(Group);
