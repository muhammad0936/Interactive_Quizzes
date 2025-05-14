import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './questions.repository';

@Injectable()
export class QuestionsService {
  constructor(private readonly questionRepository: QuestionRepository) {}
}
