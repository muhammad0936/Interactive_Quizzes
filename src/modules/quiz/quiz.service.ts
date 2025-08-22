import { Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { BaseService } from '../../common/base.service';
import { Quiz } from '../../entities/quiz.entity';
import { QuestionsService } from '../questions/questions.service';
import { CreateAndAssignQuestionDto, AssignExistingQuestionsDto, BulkCreateQuestionsDto } from './dto/assign-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from '../../entities/question.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { GroupRepository } from '../group/group.repository';

@Injectable()
export class QuizService extends BaseService<Quiz> {
  constructor(
    private readonly quizRepository: QuizRepository,
    private readonly questionsService: QuestionsService,
    private readonly groupRepo: GroupRepository,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Question.name) private readonly questionModel: Model<Question>,
  ) {
    super(quizRepository);
  }

  async create({ group, scheduledAt }: CreateQuizDto): Promise<Quiz> {
    const isGroupExist = await this.groupRepo.exists({ _id: group });
    if (!isGroupExist) throw new Error('Group not found');
    return this.repository.create({group, scheduledAt});
  }

  async createAndAssignQuestion(dto: CreateAndAssignQuestionDto) {
    // Create the question
    const question = new this.questionModel({
      text: dto.text,
      type: dto.type,
      choices: dto.choices,
      points: dto.points,
      isMath: dto.isMath,
      isMultiTrue: dto.isMultiTrue,
    });
    await question.save();
    // Assign to quiz
    const quiz = await this.quizModel.findById(dto.quizId);
    if (!quiz) throw new Error('Quiz not found');
    quiz.questions.push(question);
    await quiz.save();
    return quiz;
  }

  async assignExistingQuestions(dto: AssignExistingQuestionsDto) {
    const quiz = await this.quizModel.findById(dto.quizId);
    if (!quiz) throw new Error('Quiz not found');
    const questions = await this.questionModel.find({ _id: { $in: dto.questionIds } });
    quiz.questions.push(...questions);
    await quiz.save();
    return quiz;
  }

  async bulkCreateAndAssignQuestions(dto: BulkCreateQuestionsDto) {
    const quiz = await this.quizModel.findById(dto.quizId);
    if (!quiz) throw new Error('Quiz not found');
    const createdQuestions = await this.questionModel.insertMany(dto.questions);
    quiz.questions.push(...createdQuestions.map(q => q.toObject()));
    await quiz.save();
    return quiz;
  }
}
