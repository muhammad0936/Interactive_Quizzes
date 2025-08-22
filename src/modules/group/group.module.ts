import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../../entities/group.entity';
import { GroupRepository } from './group.repository';
import { Quiz, QuizSchema } from '../../entities/quiz.entity';
import { StudentRepository } from '../student/student.repository';
import { Student, StudentSchema } from '../../entities/student.entity';
import { Course, CourseSchema } from '../../entities/course.entity';
import { Teacher, TeacherSchema } from '../../entities/teacher.entity'; 

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Group.name,
        schema: GroupSchema,
      },
      {
        name: Quiz.name,
        schema: QuizSchema,
      },
      {
        name: Student.name,
        schema: StudentSchema,
      },
      {
        name: Course.name,
        schema: CourseSchema,
      },
      {
        name: Teacher.name,
        schema: TeacherSchema,
      },
    ]),
  ],
  controllers: [GroupController],
  providers: [
    GroupService, 
    GroupRepository,
    StudentRepository
  ],
  exports: [StudentRepository]
})
export class GroupModule {}