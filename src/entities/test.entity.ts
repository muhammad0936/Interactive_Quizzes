import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { Group } from './group.entity';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';

class QuestionChoice {
  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  isCorrect: boolean;
}

class TestQuestion {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true, type: [QuestionChoice] })
  @Type(() => QuestionChoice)
  choices: QuestionChoice[];

  @Prop({ required: true })
  points: number;
}

@Schema({ collection: 'test' })
export class Test extends BaseEntity {
  @Prop({ required: true, type: Types.ObjectId, ref: Group.name })
  group: Group;

  @Prop({ type: [TestQuestion], default: () => [] })
  @Type(() => TestQuestion)
  questions: TestQuestion[];
}

export const TestSchema = SchemaFactory.createForClass(Test);
