import { Injectable } from '@nestjs/common';
import { TestResultRepository } from './test-results.repository';

@Injectable()
export class TestResultsService {
  constructor(private readonly testResultRepository: TestResultRepository) {}
}
