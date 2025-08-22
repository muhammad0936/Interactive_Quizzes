import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRepository } from './group.repository';
import { FilterQuery, Types } from 'mongoose';
import { Group } from '../../entities/group.entity';
import { FindGroupDto } from './dto/find-group.dto';
import { escapeMongoRegex } from '../../common/utils/mongo';
import { QueryConfig } from '../../common/types/queryConfig';
import { StudentRepository } from '../student/student.repository';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository, private readonly studentRepository: StudentRepository) {}
  
  create(dto: CreateGroupDto, teacher: string) {
    return this.groupRepository.create({...dto, teacher});
  }

  async find(query?: FindGroupDto, populate?: string) {
    const filter: FilterQuery<Group> = {};
    const queryCfg: QueryConfig<Group> = {};

    if (query?.name) {
      filter.name = escapeMongoRegex(query.name);
    }

    if (query?.course) {
      filter.course = new Types.ObjectId(query.course);
    }
    if (populate) queryCfg.populate = populate;
    const groups = await this.groupRepository.find(filter, queryCfg);
    return groups;

    return this.groupRepository.findGroupsSummary(filter);
  }

  findOne(id: string) {
    return this.groupRepository.findOneById(id, { populate: 'course' });
  }

  update(id: string, dto: UpdateGroupDto) {
    return this.groupRepository.updateOneById(id, dto);
  }

  remove(id: string) {
    return this.groupRepository.deleteOneById(id);
  }

  async assignStudents(groupId: string, studentIds: string[], teacherId: string) {
    // 1. Check if group exists and teacher owns it
    const group = await this.groupRepository.findOneById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    if (group.teacher.toString() !== teacherId) {
      throw new ForbiddenException('Only the group teacher can assign students');
    }
  
    // 2. Check that all students exist
    const foundStudents = await this.studentRepository.find({
      _id: { $in: studentIds }
    });
  
    if (foundStudents.length !== studentIds.length) {
      // find missing IDs for more informative error
      const foundIds = foundStudents.map(s => s._id.toString());
      const missingIds = studentIds.filter(id => !foundIds.includes(id));
      throw new NotFoundException(`Student(s) not found: ${missingIds.join(', ')}`);
    }
  
    // 3. Avoid duplicates already in the group
    const currentStudentIds = group.students.map(s => s.toString());
    const newStudentIds = studentIds.filter(id => !currentStudentIds.includes(id));
  
    if (newStudentIds.length === 0) {
      return { message: 'All students are already in the group' };
    }
  
    // 4. Push all new students
    const updatedGroup = await this.groupRepository.updateOneById(groupId, {
      $push: { students: { $each: newStudentIds } }
    });
  
    return {
      message: `Successfully assigned ${newStudentIds.length} students to the group`,
      group: updatedGroup
    };
  }
  

  async removeStudents(groupId: string, studentIds: string[], teacherId: string) {
    // Check if group exists and teacher owns it
    const group = await this.groupRepository.findOneById(groupId, { populate: 'teacher' });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.teacher.toString() !== teacherId) {
      throw new ForbiddenException('Only the group teacher can remove students');
    }

    // Remove students from the group
    const updatedGroup = await this.groupRepository.updateOneById(groupId, {
      $pull: { students: { $in: studentIds } }
    });

    return {
      message: `Successfully removed ${studentIds.length} students from the group`,
      group: updatedGroup
    };
  }

  async getGroupStudents(groupId: string, teacherId: string) {
    // Check if group exists and teacher owns it
    const group = await this.groupRepository.findOneById(groupId, { 
      populate: 'students teacher course' 
    });
    
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    if (group.teacher.toString() !== teacherId) {
      throw new ForbiddenException('Only the group teacher can view group students');
    }

    return {
      groupId: group._id,
      groupName: group.name,
      students: group.students,
      totalStudents: group.students.length
    };
  }
}
