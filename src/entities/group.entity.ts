import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { Teacher } from './teacher.entity';
import { Material } from './material.entity';
import { Types } from 'mongoose';
import { Student } from './student.entity';

@Schema({ collection: 'group' })
export class Group extends BaseEntity {
  @Prop({ required: true })
  num: number;

  @Prop({ required: true, type: Types.ObjectId, ref: Teacher.name })
  teacher: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Material.name })
  material: Types.ObjectId;

  @Prop({ required: true, type: [Types.ObjectId], ref: Student.name })
  students: Types.ObjectId[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
