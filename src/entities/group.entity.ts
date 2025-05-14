import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { Teacher } from './teacher.entity';
import { Material } from './material.entity';
import { Types } from 'mongoose';
import { Student } from './student.entity';

@Schema({ collection: 'group' })
export class Group extends BaseEntity {
  @Prop({ required: true })
  num: Number;

  @Prop({ required: true, type: Types.ObjectId, ref: Teacher.name })
  teacher: Teacher;
  
  @Prop({ required: true, type: Types.ObjectId, ref: Material.name })
  material: Material;

  @Prop({ required: true, type: [Types.ObjectId], ref: Student.name })
  students: Student[];
}

export const GroupSchema = SchemaFactory.createForClass(Group);
