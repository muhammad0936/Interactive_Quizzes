import { Injectable } from '@nestjs/common';
import { GroupRepository } from './groups.repository';
import { BaseService } from '../../common/base.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGrouptDto } from './dto/update-group.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from '../../entities/group.entity';
import { Model, Types } from 'mongoose';
import { Teacher } from '../../entities/teacher.entity';
import { Material } from '../../entities/material.entity';
import { Student } from '../../entities/student.entity';
import { StudentRepository } from '../student/student.repository';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly studentRepository: StudentRepository,
    @InjectModel(Group.name) private groupModel: Model<Group>,
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
    @InjectModel(Material.name) private materialModel: Model<Material>,
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}
  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const teacher = await this.teacherModel.findById(createGroupDto.teacher);
    if (!teacher) {
      throw new Error('Teacher not found');
    }

    const material = await this.materialModel.findById(createGroupDto.material);
    if (!material) {
      throw new Error('Material not found');
    }
    const studentsCount = await this.studentRepository.countDocuments({
      _id: { $in: createGroupDto.students },
    });
    if (studentsCount !== createGroupDto.students.length) {
      throw new Error('One or more students not found');
    }
    const createdGroup = new this.groupModel(createGroupDto);
    return createdGroup.save();
  }

  findAll() {
    return this.groupRepository.find();
  }

  findOne(id: string) {
    return this.groupRepository.findOneById(id);
  }

  update(id: string, updateGroupDto: UpdateGrouptDto) {
    return this.groupRepository.updateOneById(id, updateGroupDto);
  }

  remove(id: string) {
    return this.groupRepository.deleteOneById(id);
  }
}
