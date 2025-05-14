import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group, GroupSchema } from 'src/entities/group.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { GroupRepository } from './groups.repository';

@Module({
  imports: [MongooseModule.forFeature([{name: Group.name, schema: GroupSchema}])],
  providers: [GroupsService, GroupRepository],
  controllers: [GroupsController]
})
export class GroupsModule {}
