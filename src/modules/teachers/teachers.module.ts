import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from './teachers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, TeacherSchema } from 'src/entities/teacher.entity';
import { TeacherRepository } from './teachers.repository';
import { User, UserSchema } from 'src/entities/user.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: Teacher.name, schema: TeacherSchema}]),MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  providers: [TeachersService, TeacherRepository],
  controllers: [TeachersController]
})
export class TeachersModule {}
