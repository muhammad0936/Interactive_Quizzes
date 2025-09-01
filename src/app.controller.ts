import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('app')
@Controller()
@UseInterceptors(FileInterceptor('file', multerConfig))
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Hello message retrieved successfully',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
