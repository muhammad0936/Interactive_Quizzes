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
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { LoginAdminDto } from './dto/login-admin.dto';
import { sign } from 'jsonwebtoken';
import { UserType } from 'src/entities/enums/user-type.enum';
import { GetAdminsFilterDto } from './dto/get-admins-filter.dto';
import { Admin } from '../../entities/admin.entity';
import { ApiTags, ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('admin')
@Controller('admin')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('admin')
  @ApiBody({ type: CreateAdminDto, description: 'Admin creation data' })
  @ApiResponse({ status: 201, description: 'Admin created successfully' })
  async create(@Body() createAdminDto: CreateAdminDto) {
    return await this.adminService.createAdmin(createAdminDto);
  }

  @Post('login')
  @ApiBody({ type: LoginAdminDto, description: 'Admin login credentials' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() { email, password }: LoginAdminDto): Promise<Object> {
    const admin = await this.adminService.checkLoginData({ email, password });
    const jwtToken = `Bearer ${sign(
      { email, userId: admin._id, role: UserType.ADMIN },
      'thisismysecretkey',
      { expiresIn: '30d' },
    )}`;
    return { jwtToken };
  }

  @Get()
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Filter admins by name',
  })
  @ApiResponse({
    status: 200,
    description: 'List of admins retrieved successfully',
  })
  async getAdmins(@Query() { name }: GetAdminsFilterDto): Promise<Admin[]> {
    return this.adminService.getAdmins({ name });
  }
}
