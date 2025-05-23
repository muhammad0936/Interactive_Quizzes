import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';
import { LoginAdminDto } from './dto/login-admin.dto';
import { sign } from 'jsonwebtoken';
import { UserType } from 'src/entities/enums/user-type.enum';

@Controller('admin')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('admin')
  async create(@Body() createAdminDto: CreateAdminDto) {
    return await this.adminService.createAdmin(createAdminDto);
  }

  @Post('login')
  async login(@Body() { email, password }: LoginAdminDto): Promise<Object> {
    const admin = await this.adminService.checkLoginData({ email, password });
    const jwtToken = `Bearer ${sign(
      { email, userId: admin._id, role: UserType.ADMIN },
      'thisismysecretkey',
      { expiresIn: '30d' },
    )}`;
    return { jwtToken };
  }
}
