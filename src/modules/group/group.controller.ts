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
} from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { TeacherGuard } from '../../guards/teacher.guard';
import { GroupSummary } from './dto/group-summary.dto';
import { FindGroupDto } from './dto/find-group.dto';
import { Group } from '../../entities/group.entity';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(TeacherGuard)
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @Get()
  findAll(@Query() query: FindGroupDto): Promise<GroupSummary[]> {
    return this.groupService.find(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Group> {
    const group = await this.groupService.findOne(id);
    if (group == null) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(id);
  }
}
