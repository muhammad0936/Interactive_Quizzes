import { Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { BaseService } from '../../common/base.service';
import { Quiz } from '../../entities/quiz.entity';

@Injectable()
export class QuizService extends BaseService<Quiz> {
  constructor(private readonly quizRepository: QuizRepository) {
    super(quizRepository);
  }
}
