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
@Controller('student')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  @UseGuards(TeacherGuard)
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentService.create(createStudentDto);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(TeacherGuard)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(id, updateStudentDto);
  }
  @Post('login')
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

  @Delete(':id')
  @UseGuards(TeacherGuard)
  remove(@Param('id') id: string) {
    return this.studentService.remove(id);
  }
}
