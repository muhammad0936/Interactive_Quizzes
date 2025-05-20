import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentRepository } from './student.repository';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  create(createStudentDto: CreateStudentDto) {
    return this.studentRepository.create(createStudentDto);
  }

  findAll() {
    return this.studentRepository.find();
  }

  findOne(id: string) {
    return this.studentRepository.findOneById(id);
  }

  update(id: string, updateStudentDto: UpdateStudentDto) {
    return this.studentRepository.updateOneById(id, updateStudentDto);
  }

  remove(id: string) {
    return this.studentRepository.deleteOneById(id);
  }
}
