import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group, GroupSchema } from 'src/entities/group.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupRepository } from './groups.repository';
import { TeachersService } from '../teachers/teachers.service';
import { MaterialsService } from '../materials/materials.service';
import { StudentService } from '../student/student.service';
import { Teacher, TeacherSchema } from '../../entities/teacher.entity';
import { Material, MaterialSchema } from '../../entities/material.entity';
import { Student, StudentSchema } from '../../entities/student.entity';
import { TeacherRepository } from '../teachers/teachers.repository';
import { MaterialRepository } from '../materials/materials.repository';
import { StudentRepository } from '../student/student.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Teacher.name, schema: TeacherSchema },
      { name: Material.name, schema: MaterialSchema },
      { name: Student.name, schema: StudentSchema },
    ]),
  ],
  providers: [
    GroupsService,
    GroupRepository,
    TeachersService,
    TeacherRepository,
    MaterialsService,
    MaterialRepository,
    StudentService,
    StudentRepository,
  ],
  controllers: [GroupsController],
})
export class GroupsModule {}
