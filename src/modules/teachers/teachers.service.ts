import { Injectable } from '@nestjs/common';
import { TeacherRepository } from './teachers.repository';
import { UserService } from '../user/user.service';
import { UserType } from 'src/entities/enums/user-type.enum';
import { BaseService } from 'src/common/base.service';
import { Teacher } from 'src/entities/teacher.entity';
import { CreateTeachertDto } from './dto/create-teacher.dto';
import { hashSync } from 'bcryptjs';
import { hash } from 'bcryptjs';

@Injectable()
export class TeachersService extends BaseService<Teacher>{
  constructor(private readonly teacherRepository: TeacherRepository) {
    super(teacherRepository)
  }

  async ensureIsTeacher(id: string): Promise<Boolean>{
    const admin = await this.teacherRepository.exists({userType:UserType.TEACHER, _id: id});
    return admin ? true: false;
  }

  async createStudent(teacherData: CreateTeachertDto): Promise<Teacher>{
    const hashedPassword = await hash(teacherData.password,12);
    const admin = await this.teacherRepository.create({...teacherData, password:hashedPassword});
    return admin
  }
  }
