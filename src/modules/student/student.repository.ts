// students/repository/student.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from '../../entities/student.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class StudentRepository extends BaseRepository<Student> {
  constructor(
    @InjectModel(Student.name) private readonly studentModel: Model<Student>,
  ) {
    super(studentModel);
  }

  // Add custom methods specific to Student
  async findByType(type: string): Promise<Student[]> {
    return this.studentModel.find({ type }).exec();
  }
}
