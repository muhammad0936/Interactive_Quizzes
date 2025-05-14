import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './config/multer.config';

@Controller()
@UseInterceptors(FileInterceptor('file', multerConfig))
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
