import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TeacherRepository } from './teachers.repository';
import { AdminGuard } from '../../guards/admin.guard';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { TeachersService } from './teachers.service';
import { FilterQuery } from 'mongoose';
import { Teacher } from '../../entities/teacher.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';
import { LoginTeacherDto } from './dto/login-teacher.dto';
import { sign } from 'jsonwebtoken';
import { UserType } from '../../entities/enums/user-type.enum';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('teachers')
@Controller('teachers')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBody({ type: CreateTeacherDto, description: 'Teacher creation data' })
  @ApiResponse({ status: 201, description: 'Teacher created successfully' })
  async createTeacher(@Body() teacherData: CreateTeacherDto) {
    return this.teachersService.createTeacher(teacherData);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiParam({ name: 'id', description: 'Teacher ID' })
  @ApiResponse({ status: 200, description: 'Teacher deleted successfully' })
  async deleteTeacher(@Param('id') id: string) {
    this.teachersService.removeById(id);
    return { message: 'Teacher deleted.' };
  }

  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter teachers by name',
  })
  @ApiQuery({
    name: 'email',
    required: false,
    description: 'Filter teachers by email',
  })
  @ApiResponse({
    status: 200,
    description: 'List of teachers retrieved successfully',
  })
  async getTeachers(@Query() query: FilterQuery<Teacher> = {}) {
    return this.teachersService.getTeachers(query);
  }

  @Post('login')
  @ApiBody({ type: LoginTeacherDto, description: 'Teacher login credentials' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() { email, password }: LoginTeacherDto): Promise<Object> {
    const student = await this.teachersService.checkLoginData({
      email,
      password,
    });
    const jwtToken = `Bearer ${sign(
      { email, userId: student._id, role: UserType.TEACHER },
      'thisismysecretkey',
      { expiresIn: '30d' },
    )}`;
    return { jwtToken };
  }
}
