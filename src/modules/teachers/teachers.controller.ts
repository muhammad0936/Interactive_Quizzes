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

@Controller('teachers')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class TeachersController {
  constructor(private readonly teachersService: TeachersService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createTeacher(@Body() teacherData: CreateTeacherDto) {
    return this.teachersService.createTeacher(teacherData);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteTeacher(@Param('id') id: string) {
    this.teachersService.removeById(id);
    return { message: 'Teacher deleted.' };
  }
  @Get()
  async getTeachers(@Query() query: FilterQuery<Teacher>) {
    return this.teachersService.getTeachers(query);
  }

  @Post('login')
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
