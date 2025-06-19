import { BadRequestException, Injectable } from '@nestjs/common';
import { TeacherRepository } from './teachers.repository';
import { UserService } from '../user/user.service';
import { UserType } from 'src/entities/enums/user-type.enum';
import { BaseService } from 'src/common/base.service';
import { Teacher } from 'src/entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { compare, hashSync } from 'bcryptjs';
import { hash } from 'bcryptjs';
import { FilterQuery } from 'mongoose';
import { LoginTeacherDto } from './dto/login-teacher.dto';

@Injectable()
export class TeachersService extends BaseService<Teacher> {
  constructor(private readonly teacherRepository: TeacherRepository) {
    super(teacherRepository);
  }

  async ensureIsTeacher(id: string): Promise<Boolean> {
    const admin = await this.teacherRepository.exists({
      userType: UserType.TEACHER,
      _id: id,
    });
    return admin ? true : false;
  }

  async createTeacher({
    email,
    name,
    password,
  }: CreateTeacherDto): Promise<Teacher> {
    const isExsist = await this.teacherRepository.exists({ email });
    if (isExsist)
      throw new BadRequestException('This email is already registered.');
    const hashedPassword = await hash(password, 12);
    const teacher = await this.teacherRepository.create({
      email,
      name,
      password: hashedPassword,
      userType: UserType.TEACHER,
    });
    return teacher;
  }

  async getTeachers(query: FilterQuery<Teacher>): Promise<Teacher[]> {
    return this.teacherRepository.findTeachers({
      ...query,
      userType: UserType.TEACHER,
    });
  }

  async checkLoginData({ email, password }: LoginTeacherDto): Promise<Teacher> {
    const teacher = await this.teacherRepository.findByEmailWithPassword(email);
    if (teacher.userType !== UserType.TEACHER)
      throw new BadRequestException('Invalid login data');
    if (!teacher) throw new BadRequestException('Invalid login data');
    const isMatchPassword = await compare(password, teacher.password);
    if (!isMatchPassword) throw new BadRequestException('Invalid login data');
    return teacher;
  }
}
