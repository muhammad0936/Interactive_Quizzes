// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Group } from '../../entities/group.entity';
import { BaseRepository } from '../../common/base.repository';
import { plainToInstance } from 'class-transformer';
import { GroupSummary } from './dto/group-summary.dto';

@Injectable()
export class GroupRepository extends BaseRepository<Group> {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {
    super(groupModel);
  }

  async findGroupsSummary(filter: FilterQuery<Group>) {
    const results = await this.groupModel
      .find(filter, {
        _id: 1,
        name: 1,
        studentCount: { $size: '$students' },
      })
      .lean()
      .exec();

    return plainToInstance(GroupSummary, results);
  }
}
