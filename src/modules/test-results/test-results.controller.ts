import { Controller, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';

@Controller('test-results')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class TestResultsController {}
