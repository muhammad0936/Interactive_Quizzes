// test.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { Group } from './group.entity';
import { Question, QuestionSchema } from './question.entity';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { IsString, Length } from 'class-validator';
import { Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'quiz' })
export class Quiz extends BaseEntity {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Group.name,
    required: true,
  })
  group: Group;

  @Prop({
    type: [{ type: SchemaTypes.ObjectId, ref: Question.name }],
    default: [],
  })
  questions: Question[];

  @Prop({ default: Date.now })
  scheduledAt: Date;

  @Prop({ unique: true })
  accessCode: string;

  @Prop({ default: false })
  isOver: boolean;
}

export type QuizDocument = HydratedDocument<
  Quiz,
  {
    queries: Types.DocumentArray<Question>;
  }
>;

export const QuizSchema = SchemaFactory.createForClass(Quiz);

// Helper function to generate 8-digit code
function generateAccessCode(): string {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Pre-save hook to assign accessCode if not present
QuizSchema.pre('save', function (next) {
  if (!this.accessCode) {
    this.accessCode = generateAccessCode();
  }
  next();
});
