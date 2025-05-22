import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';

@Schema({ collection: 'course' })
export class Course extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  year: string;

  @Prop()
  semester: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
