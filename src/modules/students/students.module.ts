import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Student, StudentSchema } from 'src/entities/student.entity';
import { StudentRepository } from './students.repository';
import { User, UserSchema } from 'src/entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: Student.name, schema: StudentSchema}]),MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  providers: [StudentsService,StudentRepository],
  controllers: [StudentsController]
})
export class StudentsModule {}
