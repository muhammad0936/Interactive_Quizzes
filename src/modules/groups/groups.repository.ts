// questions/repository/question.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from '../../entities/group.entity';
import { BaseRepository } from '../../common/base.repository';

@Injectable()
export class GroupRepository extends BaseRepository<Group> {
  constructor(
    @InjectModel(Group.name) private readonly groupModel: Model<Group>,
  ) {
    super(groupModel);
  }

  // Add custom methods specific to Group
  async findByType(type: string): Promise<Group[]> {
    return this.groupModel.find({ type }).exec();
  }
}
