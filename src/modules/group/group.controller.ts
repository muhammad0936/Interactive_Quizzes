import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  NotFoundException,
  Req,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { TeacherGuard } from '../../guards/teacher.guard';
import { GroupSummary } from './dto/group-summary.dto';
import { FindGroupDto } from './dto/find-group.dto';
import { Group } from '../../entities/group.entity';
import { Request } from 'express';
import {
  ApiTags,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AssignStudentDto } from './dto/assign-student.dto';
import { RemoveStudentDto } from './dto/remove-student.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';

@ApiTags('group')
@Controller('group')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(TeacherGuard)
  @ApiBody({ type: CreateGroupDto, description: 'Group creation data' })
  @ApiResponse({ status: 201, description: 'Group created successfully' })
  create(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    return this.groupService.create(createGroupDto, req.userId as string);
  }

  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter groups by name',
  })
  @ApiQuery({
    name: 'course',
    required: false,
    description: 'Filter groups by course ID',
  })
  @ApiQuery({
    name: 'teacher',
    required: false,
    description: 'Filter groups by teacher ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of groups retrieved successfully',
  })
  findAll(@Query() query: any = {}) {
    return this.groupService.find(query, 'students teacher course');
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  async findOne(@Param('id') id: string): Promise<Group> {
    const group = await this.groupService.findOne(id);
    if (group == null) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiBody({ type: UpdateGroupDto, description: 'Group update data' })
  @ApiResponse({ status: 200, description: 'Group updated successfully' })
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({ status: 200, description: 'Group deleted successfully' })
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }

  @Post(':id/assign-students')
  @UseGuards(TeacherGuard)
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiBody({
    type: AssignStudentDto,
    description: 'Student IDs to assign to the group',
  })
  @ApiResponse({ status: 200, description: 'Students assigned successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - not the group teacher',
  })
  async assignStudents(
    @Param('id') groupId: string,
    @Body() assignStudentDto: AssignStudentDto,
    @Req() req: Request,
  ) {
    return this.groupService.assignStudents(
      groupId,
      assignStudentDto.studentIds,
      req.userId as string,
    );
  }

  @Post(':id/remove-students')
  @UseGuards(TeacherGuard)
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiBody({
    type: RemoveStudentDto,
    description: 'Student IDs to remove from the group',
  })
  @ApiResponse({ status: 200, description: 'Students removed successfully' })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - not the group teacher',
  })
  async removeStudents(
    @Param('id') groupId: string,
    @Body() removeStudentDto: RemoveStudentDto,
    @Req() req: Request,
  ) {
    return this.groupService.removeStudents(
      groupId,
      removeStudentDto.studentIds,
      req.userId as string,
    );
  }

  @Get(':id/students')
  @UseGuards(TeacherGuard)
  @ApiParam({ name: 'id', description: 'Group ID' })
  @ApiResponse({
    status: 200,
    description: 'Group students retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Group not found' })
  @ApiResponse({
    status: 403,
    description: 'Access denied - not the group teacher',
  })
  async getGroupStudents(@Param('id') groupId: string, @Req() req: Request) {
    return this.groupService.getGroupStudents(groupId, req.userId as string);
  }
}
