import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentRepository } from './student.repository';
import { UserType } from '../../entities/enums/user-type.enum';
import { LoginStudentDto } from './dto/login-student.dto';
import { Student } from '../../entities/student.entity';
import { compare } from 'bcryptjs';
import { hash } from 'bcryptjs';
import { FilterQuery } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quiz } from '../../entities/quiz.entity';
import { Group } from '../../entities/group.entity';

@Injectable()
export class StudentService {
  constructor(
    private readonly studentRepository: StudentRepository,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {}

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

  findAll(query: FilterQuery<Student> = {}) {
    return this.studentRepository.find({ userType: UserType.STUDENT, ...query });
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

  async accessQuizByCode(accessCode: string, studentId: string) {
    // Find the quiz by access code
    const quiz = await this.quizModel.findOne({ accessCode }).populate('group')
    .populate('questions'); 
    console.log(quiz)
    if (!quiz) {
      throw new NotFoundException('Quiz not found with this access code');
    }

    // Check if quiz is over
    if (quiz.isOver) {
      throw new ForbiddenException('This quiz has already ended');
    }

    // Check if the student belongs to the group this quiz is assigned to
    const group = await this.groupModel.findById(quiz.group);
    if (!group) {
      throw new NotFoundException('Group not found for this quiz');
    }

    // Check if student is in the group
    const isStudentInGroup = group.students.some(
      (student: any) => student.toString() === studentId
    );

    if (!isStudentInGroup) {
      throw new ForbiddenException('You are not authorized to access this quiz. You must be a member of the group.');
    }

    // Return quiz details (without answers)
    return {
      _id: quiz._id,
      group: quiz.group,
      scheduledAt: quiz.scheduledAt,
      isOver: quiz.isOver,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        text: q.text,
        type: q.type,
        points: q.points,
        isMath: q.isMath,
        isMultiTrue: q.isMultiTrue,
        choices: q.choices.map(c => ({
          text: c.text,
          // Don't include isCorrect to prevent cheating
        }))
      }))
    };
  }
}
