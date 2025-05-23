import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseRepository } from './course.repository';
import { FindCourseDto } from './dto/find-course.dto';
import { FilterQuery } from 'mongoose';
import { Course } from '../../entities/course.entity';
import { escapeMongoRegex } from '../../common/utils/mongo';

@Injectable()
export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  create(dto: CreateCourseDto) {
    return this.courseRepository.create(dto);
  }

  async findAll(query: FindCourseDto) {
    const filter: FilterQuery<Course> = {};

    if (query.name) {
      filter.name = escapeMongoRegex(query.name);
    }

    if (query.year) {
      filter.year = query.year;
    }

    if (query.semester) {
      filter.semester = query.semester;
    }
    return this.courseRepository.find(filter);
  }

  async findOne(id: string) {
    const course = await this.courseRepository.findOneById(id);

    return course;
  }

  update(id: string, dto: UpdateCourseDto) {
    return this.courseRepository.updateOneById(id, dto);
  }

  remove(id: string) {
    return this.courseRepository.deleteOneById(id);
  }
}
