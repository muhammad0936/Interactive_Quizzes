import { Injectable } from '@nestjs/common';
import { StudentRepository } from './students.repository';
import { BaseService } from 'src/common/base.service';
import { Student } from 'src/entities/student.entity';
import { UserType } from 'src/entities/enums/user-type.enum';
import { CreateStudentDto } from './dto/create-student.dto';
import { hash } from 'bcryptjs';

@Injectable()
export class StudentsService extends BaseService<Student> {
  constructor(private readonly studentRepository: StudentRepository) {
    super(studentRepository)
  }
  async ensureIsStudent(id: string): Promise<Boolean>{
    const admin = await this.studentRepository.exists({userType:UserType.STUDENT, _id: id});
    return admin ? true: false;
  }
  
    async createStudent(studentData: CreateStudentDto): Promise<Student>{
      const hashedPassword = await hash(studentData.password,12);
      const admin = await this.studentRepository.create({...studentData, password:hashedPassword});
      return admin
    }
}
