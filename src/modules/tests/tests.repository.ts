// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../entities/quiz.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class TestRepository extends BaseRepository<Quiz> {
  constructor(@InjectModel(Quiz.name) private readonly testModel: Model<Quiz>) {
    super(testModel);
  }

  // Add custom methods specific to Test
  async findByType(type: string): Promise<Quiz[]> {
    return this.testModel.find({ type }).exec();
  }
}
