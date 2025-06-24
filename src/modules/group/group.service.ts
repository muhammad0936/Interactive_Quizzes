import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupRepository } from './group.repository';
import { FilterQuery, Types } from 'mongoose';
import { Group } from '../../entities/group.entity';
import { FindGroupDto } from './dto/find-group.dto';
import { escapeMongoRegex } from '../../common/utils/mongo';
import { QueryConfig } from '../../common/types/queryConfig';

@Injectable()
export class GroupService {
  constructor(private readonly groupRepository: GroupRepository) {}
  create(dto: CreateGroupDto) {
    return this.groupRepository.create(dto);
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
    console.log(populate);
    const groups = await this.groupRepository.find(filter, queryCfg);
    console.log(groups);
    return groups;
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
}
