import { Injectable } from '@nestjs/common';
import { GroupRepository } from './groups.repository';

@Injectable()
export class GroupsService {
  constructor(private readonly groupRepository: GroupRepository) {}
}
