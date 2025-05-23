// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../../entities/question.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class QuestionRepository extends BaseRepository<Question> {
  constructor(
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {
    super(questionModel);
  }

  // Add custom methods specific to Question
  async findByType(type: string): Promise<Question[]> {
    return this.questionModel.find({ type }).exec();
  }
}
