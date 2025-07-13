import { Module } from '@nestjs/common';
import { QuizResultsService } from './test-results.service';
import { QuizResultsController } from './test-results.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizResult, QuizResultSchema } from 'src/entities/quiz-result.entity';
import { QuizResultRepository } from './test-results.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizResult.name, schema: QuizResultSchema },
    ]),
  ],
  providers: [QuizResultsService, QuizResultRepository],
  controllers: [QuizResultsController],
})
export class QuizResultsModule {}
