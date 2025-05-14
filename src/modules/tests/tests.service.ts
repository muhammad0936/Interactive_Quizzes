import { Injectable } from '@nestjs/common';
import { TestRepository } from './tests.repository';

@Injectable()
export class TestsService {
  constructor(private readonly testRepository: TestRepository) {}
}
