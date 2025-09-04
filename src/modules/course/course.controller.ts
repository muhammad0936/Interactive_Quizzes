import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FindCourseDto } from './dto/find-course.dto';
import { AdminGuard } from '../../guards/admin.guard';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(AdminGuard)
  @ApiBody({ type: CreateCourseDto, description: 'Course creation data' })
  @ApiResponse({ status: 201, description: 'Course created successfully' })
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter courses by name',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Filter courses by year',
  })
  @ApiQuery({
    name: 'semester',
    required: false,
    description: 'Filter courses by semester',
  })
  @ApiResponse({
    status: 200,
    description: 'List of courses retrieved successfully',
  })
  findAll(@Query() query: FindCourseDto) {
    console.log('hit');
    return this.courseService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiBody({ type: UpdateCourseDto, description: 'Course update data' })
  @ApiResponse({ status: 200, description: 'Course updated successfully' })
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Course ID' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
