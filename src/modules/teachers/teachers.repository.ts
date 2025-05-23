// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Teacher } from '../../entities/teacher.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class TeacherRepository extends BaseRepository<Teacher> {
  constructor(
    @InjectModel(Teacher.name) private readonly teacherModel: Model<Teacher>,
  ) {
    super(teacherModel);
  }

  // Add custom methods specific to Teacher
  async findByType(type: string): Promise<Teacher[]> {
    return this.teacherModel.find({ type }).exec();
  }
  async findTeachers(query: FilterQuery<Teacher>): Promise<Teacher[]> {
    return this.teacherModel.find(query);
  }
}
