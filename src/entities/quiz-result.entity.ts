// test-result.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from './base.entity';
import { Student } from './student.entity';
import { Quiz } from './quiz.entity';
import { Types } from 'mongoose';

@Schema({ collection: 'quiz_result' })
export class QuizResult extends BaseEntity {
  @Prop({
    type: Types.ObjectId,
    ref: Student.name,
    required: true,
  })
  student: Student;

  @Prop({
    type: Types.ObjectId,
    ref: Quiz.name,
    required: true,
  })
  quiz: Quiz;

  @Prop({
    required: true,
    min: 0,
    max: 100,
  })
  scorePercentage: number;

  @Prop({ default: Date.now })
  completedAt: Date;
}

export const QuizResultSchema = SchemaFactory.createForClass(QuizResult);
