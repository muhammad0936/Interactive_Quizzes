import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Group, GroupSchema } from '../../entities/group.entity';
import { GroupRepository } from './group.repository';
import { Quiz, QuizSchema } from '../../entities/quiz.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Group.name,
        schema: GroupSchema,
      },
      {
        name: Quiz.name,
        schema: QuizSchema,
      },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
})
export class GroupModule {}
