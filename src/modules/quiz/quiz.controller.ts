import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';
import { QuizService } from './quiz.service';
import { TeacherGuard } from '../../guards/teacher.guard';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from '../../entities/quiz.entity';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { CreateAndAssignQuestionDto, AssignExistingQuestionsDto, BulkCreateQuestionsDto } from './dto/assign-question.dto';

@Controller('quiz')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(TeacherGuard)
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Quiz> {
    const quiz = await this.quizService.findOne(id);
    if (quiz == null) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.updateById(id, updateQuizDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizService.removeById(id);
  }

  @Post('bulk-create-questions')
  @UseGuards(TeacherGuard)
  async bulkCreateQuestions(
    @Body() body: BulkCreateQuestionsDto,
  ) {
    return this.quizService.bulkCreateAndAssignQuestions(body);
  }
}
