// test.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { Group } from './group.entity';
import { Question, QuestionSchema } from './question.entity';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

@Schema({ collection: 'quiz' })
export class Quiz extends BaseEntity {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Group.name,
    required: true,
  })
  group: Group;

  @Prop([
    {
      type: [QuestionSchema],
      default: () => [],
    },
  ])
  questions: Question[];

  @Prop({ default: Date.now })
  scheduledAt: Date;
}

export type QuizDocument = HydratedDocument<
  Quiz,
  {
    queries: Types.DocumentArray<Question>;
  }
>;

export const QuizSchema = SchemaFactory.createForClass(Quiz);
