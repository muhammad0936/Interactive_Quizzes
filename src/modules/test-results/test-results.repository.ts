// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QuizResult } from '../../entities/quiz-result.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class QuizResultRepository extends BaseRepository<QuizResult> {
  constructor(
    @InjectModel(QuizResult.name)
    private readonly testResultModel: Model<QuizResult>,
  ) {
    super(testResultModel);
  }

  // Add custom methods specific to QuizResult
  async findByType(type: string): Promise<QuizResult[]> {
    return this.testResultModel.find({ type }).exec();
  }
}
