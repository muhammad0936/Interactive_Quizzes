import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentRepository } from './student.repository';
import { UserType } from '../../entities/enums/user-type.enum';
import { LoginStudentDto } from './dto/login-student.dto';
import { Student } from '../../entities/student.entity';
import { compare } from 'bcryptjs';
import { hash } from 'bcryptjs';

@Injectable()
export class StudentService {
  constructor(private readonly studentRepository: StudentRepository) {}

  async create({ email, name, password, studentNumber }: CreateStudentDto) {
    const isExsist = await this.studentRepository.exists({ email });
    if (isExsist)
      throw new BadRequestException('This email is already registered.');
    const hashedPassword = await hash(password, 12);
    const student = await this.studentRepository.create({
      email,
      name,
      studentNumber,
      password: hashedPassword,
      userType: UserType.STUDENT,
    });
    return student;
  }

  findAll() {
    return this.studentRepository.find({ userType: UserType.STUDENT });
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
  async checkLoginData({ email, password }: LoginStudentDto): Promise<Student> {
    const student = await this.studentRepository.findByEmailWithPassword(email);
    if (student.userType !== UserType.STUDENT)
      throw new BadRequestException('Invalid login data');
    if (!student) throw new BadRequestException('Invalid login data');
    const isMatchPassword = await compare(password, student.password);
    if (!isMatchPassword) throw new BadRequestException('Invalid login data');
    return student;
  }
}
