import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';
import { AdminGuard } from '../../guards/admin.guard';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupsService } from './groups.service';
import { UpdateGrouptDto } from './dto/update-group.dto';

@Controller('groups')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  @UseGuards(AdminGuard)
  async createTeacher(@Body() groupData: CreateGroupDto) {
    return this.groupsService.create(groupData);
  }
  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGrouptDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
