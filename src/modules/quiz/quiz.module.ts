import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from 'src/entities/quiz.entity';
import { QuizRepository } from './quiz.repository';
import { QuestionsModule } from '../questions/questions.module';
import { QuestionsService } from '../questions/questions.service';
import { QuestionsController } from '../questions/questions.controller';
import { Question, QuestionSchema } from '../../entities/question.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { QuestionRepository } from '../questions/questions.repository';
import { GroupService } from '../group/group.service';
import { GroupRepository } from '../group/group.repository';
import { Group, GroupSchema } from '../../entities/group.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quiz.name, schema: QuizSchema },
      { name: Question.name, schema: QuestionSchema },
      { name: Group.name, schema: GroupSchema },
    ]),
    QuestionsModule,
  ],
  providers: [
    QuizService,
    QuizRepository,
    QuestionsService,
    QuestionRepository,
    GroupRepository,
  ],
  controllers: [QuizController, QuestionsController],
  exports: [QuestionsService, GroupRepository],
})
export class QuizModule {}
