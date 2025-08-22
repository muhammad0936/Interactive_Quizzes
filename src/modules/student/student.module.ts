import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from '../../entities/student.entity';
import { StudentRepository } from './student.repository';
import { Quiz, QuizSchema } from '../../entities/quiz.entity';
import { Group, GroupSchema } from '../../entities/group.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Student.name, schema: StudentSchema },
      { name: Quiz.name, schema: QuizSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
  ],
  controllers: [StudentController],
  providers: [StudentService, StudentRepository],
})
export class StudentModule {}
