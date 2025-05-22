// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course } from '../../entities/course.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class CourseRepository extends BaseRepository<Course> {
  constructor(
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
  ) {
    super(courseModel);
  }
}
