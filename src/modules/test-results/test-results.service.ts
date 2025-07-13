import { Injectable } from '@nestjs/common';
import { QuizResultRepository } from './test-results.repository';

@Injectable()
export class QuizResultsService {
  constructor(private readonly testResultRepository: QuizResultRepository) {}
}
