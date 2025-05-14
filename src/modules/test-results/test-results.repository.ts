// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TestResult } from '../../entities/test-result.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class TestResultRepository extends BaseRepository<TestResult> {
  constructor(@InjectModel(TestResult.name) private readonly testResultModel: Model<TestResult>) {
    super(testResultModel);
  }

  // Add custom methods specific to TestResult
  async findByType(type: string): Promise<TestResult[]> {
    return this.testResultModel.find({ type }).exec();
  }
}