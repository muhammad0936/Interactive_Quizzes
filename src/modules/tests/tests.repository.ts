// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from '../../entities/test.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class TestRepository extends BaseRepository<Test> {
  constructor(@InjectModel(Test.name) private readonly testModel: Model<Test>) {
    super(testModel);
  }

  // Add custom methods specific to Test
  async findByType(type: string): Promise<Test[]> {
    return this.testModel.find({ type }).exec();
  }
}
