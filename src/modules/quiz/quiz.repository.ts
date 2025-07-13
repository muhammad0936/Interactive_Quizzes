// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../entities/quiz.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class QuizRepository extends BaseRepository<Quiz> {
  constructor(@InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>) {
    super(quizModel);
  }
}
