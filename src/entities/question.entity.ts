// question.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { QuestionType } from './enums/question-type.enum';

class Choice {
  @Prop({ required: true })
  text: string;

  @Prop({ required: true, default: false })
  isCorrect: boolean;
}

@Schema({ collection: 'question' })
export class Question extends BaseEntity {
  @Prop({ required: true })
  text: string;

  @Prop()
  isMath?: boolean;

  @Prop({
    required: true,
    type: String,
    enum: QuestionType,
  })
  type: QuestionType;

  @Prop({ required: true, default: 1 })
  points: number;

  @Prop({ required: true, default: false })
  isMultiTrue: boolean;

  @Prop({ type: [Choice] })
  choices: Choice[];
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
