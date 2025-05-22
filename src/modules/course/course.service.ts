import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseRepository } from './course.repository';

@Injectable()
export class CourseService {
  constructor(private courseRepository: CourseRepository) {}

  create(dto: CreateCourseDto) {
    return this.courseRepository.create(dto);
  }

  findAll() {
    return this.courseRepository.find();
  }

  findOne(id: string) {
    return this.courseRepository.findOneById(id);
  }

  update(id: string, dto: UpdateCourseDto) {
    return this.courseRepository.updateOneById(id, dto);
  }

  remove(id: string) {
    return this.courseRepository.deleteOneById(id);
  }
}
