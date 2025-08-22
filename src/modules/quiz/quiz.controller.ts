import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
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
import {
  CreateAndAssignQuestionDto,
  AssignExistingQuestionsDto,
  BulkCreateQuestionsDto,
} from './dto/assign-question.dto';
import { FilterQuery } from 'mongoose';
import { ApiBody, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('quiz')
@Controller('quiz')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(TeacherGuard)
  @ApiBody({ type: CreateQuizDto, description: 'Quiz creation data' })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizService.create(createQuizDto);
  }

  @Get()
  @UseGuards(TeacherGuard)
  @ApiQuery({ name: 'group', required: false, description: 'Filter by group ID' })
  @ApiQuery({ name: 'isOver', required: false, description: 'Filter by quiz status' })
  @ApiQuery({ name: 'accessCode', required: false, description: 'Filter by access code' })
  findAll(
    @Query('group') group?: string,
    @Query('isOver') isOver?: boolean,
    @Query('accessCode') accessCode?: string,
  ) {
    const query: FilterQuery<Quiz> = {};
    
    if (group) query.group = group;
    if (isOver !== undefined) query.isOver = isOver;
    if (accessCode) query.accessCode = accessCode;
    
    return this.quizService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  async findOne(@Param('id') id: string): Promise<Quiz> {
    const quiz = await this.quizService.findOne(id,'group questions');
    if (quiz == null) {
      throw new NotFoundException('Quiz not found');
    }
    return quiz;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  @ApiBody({ type: UpdateQuizDto, description: 'Quiz update data' })
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizService.updateById(id, updateQuizDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Quiz ID' })
  remove(@Param('id') id: string) {
    return this.quizService.removeById(id);
  }

  @Post('bulk-create-questions')
  @UseGuards(TeacherGuard)
  @ApiBody({ type: BulkCreateQuestionsDto, description: 'Bulk questions creation data' })
  async bulkCreateQuestions(@Body() body: BulkCreateQuestionsDto) {
    console.log(body)
    return this.quizService.bulkCreateAndAssignQuestions(body);
  }
}
