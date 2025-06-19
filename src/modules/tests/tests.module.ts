import { Module } from '@nestjs/common';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from 'src/entities/quiz.entity';
import { TestRepository } from './tests.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
  ],
  providers: [TestsService, TestRepository],
  controllers: [TestsController],
})
export class TestsModule {}
