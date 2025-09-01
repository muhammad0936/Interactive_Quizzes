import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';
import { LoginStudentDto } from './dto/login-student.dto';
import { sign } from 'jsonwebtoken';
import { UserType } from '../../entities/enums/user-type.enum';
import { TeacherGuard } from '../../guards/teacher.guard';
import { StudentGuard } from '../../guards/student.guard';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FilterQuery } from 'mongoose';
import { Student } from '../../entities/student.entity';
import { AccessQuizDto } from './dto/access-quiz.dto';
import { Request } from 'express';
import { AdminGuard } from '../../guards/admin.guard';

@ApiTags('student')
@Controller('student')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseGuards(TeacherGuard)
  @ApiBody({ type: CreateStudentDto, description: 'Student creation data' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  @UseGuards(TeacherGuard)
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter students by name',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter students by email',
  })
  @ApiQuery({
    name: 'studentNumber',
    required: false,
    description: 'Filter students by student number',
  })
  @ApiResponse({
    status: 200,
    description: 'List of students retrieved successfully',
  })
  findAll(@Query() query: FilterQuery<Student> = {}) {
    return this.studentService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(TeacherGuard)
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiBody({ type: UpdateStudentDto, description: 'Student update data' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }

  @Post('login')
  @ApiBody({ type: LoginStudentDto, description: 'Student login credentials' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() { email, password }: LoginStudentDto): Promise<Object> {
    const student = await this.studentService.checkLoginData({
      email,
      password,
    });
    const jwtToken = `Bearer ${sign(
      { email, userId: student._id, role: UserType.STUDENT },
      'thisismysecretkey',
      { expiresIn: '30d' },
    )}`;
    return { jwtToken };
  }

  @Post('access-quiz')
  @UseGuards(StudentGuard)
  @ApiBody({ type: AccessQuizDto, description: 'Quiz access code' })
  @ApiResponse({ status: 200, description: 'Quiz accessed successfully' })
  @ApiResponse({ status: 404, description: 'Quiz not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - not a member of the group or quiz ended',
  })
  async accessQuiz(@Body() accessQuizDto: AccessQuizDto, @Req() req: Request) {
    const studentId = (req as any).userId;
    return this.studentService.accessQuizByCode(
      accessQuizDto.accessCode,
      studentId,
    );
  }

  @Delete(':id')
  @UseGuards(TeacherGuard)
  @ApiParam({ name: 'id', description: 'Student ID' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
