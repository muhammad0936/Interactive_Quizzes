import { Controller, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../../config/multer.config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('test-results')
@Controller('test-results')
@UseInterceptors(FileInterceptor('file', multerConfig))
export class QuizResultsController {}
