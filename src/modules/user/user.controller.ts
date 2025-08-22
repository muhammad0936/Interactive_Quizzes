import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';
import { ApiTags, ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class UserController<T extends User> {
  constructor(private readonly userService: UserService<T>) {}

  @Post()
  @ApiBody({ type: CreateUserDto, description: 'User creation data' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false, description: 'Filter users by name' })
  @ApiQuery({ name: 'email', required: false, description: 'Filter users by email' })
  @ApiQuery({ name: 'userType', required: false, description: 'Filter users by user type' })
  @ApiResponse({ status: 200, description: 'List of users retrieved successfully' })
  findAll(@Query() query: any = {}) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({ type: UpdateUserDto, description: 'User update data' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update({ id }, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(@Param('id') id: string) {
    return this.userService.remove({ id });
  }
}
