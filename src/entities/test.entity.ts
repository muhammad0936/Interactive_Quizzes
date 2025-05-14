// test.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { Group } from './group.entity';
import { Question } from './question.entity';
import { Types } from 'mongoose';

@Schema({ collection: 'test' })
export class Test extends BaseEntity {
  @Prop({ 
    type: Types.ObjectId, 
    ref: Group.name, 
    required: true 
  })
  group: Group;

  @Prop([{ 
    type: [Types.ObjectId], 
    ref: Question.name, 
    required: true 
  }])
  questions: Question[];

  @Prop({ default: Date.now })
  scheduledAt: Date;
}

export const TestSchema = SchemaFactory.createForClass(Test);